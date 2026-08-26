'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import HiloEvidence from './HiloEvidence';
import HiloGraphPath, { isGraphPathResponse } from './HiloGraphPath';
import HiloReferences from './HiloReferences';
import { hiloEntityKey, prioritizeHiloNavigationItems } from '@/lib/tira-search-intent';
import { decodeTiraSession, encodeTiraSession, TIRA_SESSION_KEY } from '@/lib/tira-session';
import styles from './HiloSearch.module.css';

const starterQuestions = [
  '¿Qué imágenes de La Cena son anteriores al siglo XX?',
  '¿Qué autores han trabajado en más de un paso?',
  '¿Qué bandas acompañan a hermandades de gloria en Cantillana?',
  'Busca alguna conexión entre El Baratillo y La Cena',
];

const contextNouns = {
  brotherhood: ['hermandad', 'hermandades'],
  image: ['imagen', 'imágenes'],
  step: ['paso', 'pasos'],
  band: ['banda', 'bandas'],
  march: ['marcha', 'marchas'],
  agent: ['autor o profesional', 'autores o profesionales'],
};

const searchResultMarks = {
  brotherhood: 'H',
  image: 'IM',
  step: 'P',
  band: 'B',
  march: '♪',
  agent: 'A',
  event: 'AC',
  heritage_asset: 'PT',
  advocation: 'AV',
};

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function analyticsEntityType(value = '') {
  const type = normalize(value);
  if (type.includes('hermandad')) return 'brotherhood';
  if (type.includes('imagen')) return 'image';
  if (type.includes('paso')) return 'step';
  if (type.includes('banda')) return 'band';
  if (type.includes('marcha')) return 'march';
  if (type.includes('autor') || type.includes('profesional') || type.includes('agente')) return 'agent';
  if (type.includes('acontecimiento')) return 'event';
  if (type.includes('patrimonio')) return 'heritage_asset';
  return 'other';
}

function looksLikeQuestion(value = '') {
  const text = normalize(value);
  return /^(quien|que|cual|cuales|cuanto|cuantos|cuantas|donde|como|por que|cuando|dime|cuentame|ensename|muestrame|hay|tiene|tienen|busca)\b/.test(text)
    || value.includes('?')
    || value.includes('¿');
}

function contextLabel(context) {
  const set = context?.resultSet;
  if (!set?.entityType || !Array.isArray(set.entityIds) || !set.entityIds.length) return '';
  if (set.label) return set.label;
  const count = Number(set.count) || set.entityIds.length;
  const nouns = contextNouns[set.entityType] || ['entidad', 'entidades'];
  return `${count} ${count === 1 ? nouns[0] : nouns[1]}`;
}

function AnswerListItem({ item, index }) {
  const content = (
    <>
      <span>
        <strong>{item.label}</strong>
        {item.meta ? <small>{item.meta}</small> : null}
      </span>
      {item.href ? <b aria-hidden="true">→</b> : null}
    </>
  );

  if (item.href && item.external) {
    return (
      <a
        href={item.href}
        className={styles.answerListItem}
        key={`${item.label}-${index}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  if (item.href) {
    return (
      <Link href={item.href} className={styles.answerListItem} key={`${item.label}-${index}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={styles.answerListItem} key={`${item.label}-${index}`}>
      {content}
    </div>
  );
}

function SearchResultVisual({ item }) {
  const visual = item.visual || null;
  const kindClass = visual?.kind === 'identity' ? styles.resultVisualIdentity : styles.resultVisualPhoto;
  const fallbackType = item.entityType || analyticsEntityType(item.type);
  const fallback = searchResultMarks[fallbackType] || 'HC';

  return (
    <span
      className={`${styles.resultVisual} ${visual?.src ? kindClass : styles.resultVisualFallback}`}
      aria-hidden="true"
    >
      {visual?.src ? (
        <Image
          src={visual.src}
          alt=""
          fill
          sizes="58px"
          unoptimized={/\.svg(?:$|[?#])/i.test(visual.src)}
          style={{
            objectFit: visual.fit === 'contain' ? 'contain' : 'cover',
            objectPosition: visual.focusPosition || '50% 50%',
          }}
        />
      ) : <strong>{fallback}</strong>}
    </span>
  );
}

function SearchResultContent({ item }) {
  const descriptor = item.descriptor || item.subtitle || '';

  return (
    <>
      <SearchResultVisual item={item} />
      <span className={styles.resultCopy}>
        <span className={styles.resultMeta}>
          <span className={styles.resultType}>{item.type}</span>
          {item.location ? (
            <span className={styles.resultLocation}>
              <i aria-hidden="true" />
              {item.location}
            </span>
          ) : null}
        </span>
        <strong>{item.title}</strong>
        {descriptor ? <small>{descriptor}</small> : null}
      </span>
      <span className={styles.resultAction}>
        <small>{item.href ? 'Abrir ficha' : 'Preguntar'}</small>
        <span className={styles.arrow} aria-hidden="true">{item.href ? '→' : '↗'}</span>
      </span>
    </>
  );
}

function AssistantAnswer({ message, onFollowUp, compact = false }) {
  const response = message.response || {};
  const visibleItems = compact ? (response.items || []).slice(0, 3) : (response.items || []);
  const visibleEntities = compact ? (response.entities || []).slice(0, 3) : (response.entities || []);
  const hasEntities = visibleEntities.length > 0;
  const hasItems = visibleItems.length > 0;
  const isGraphPath = isGraphPathResponse(response);

  return (
    <div className={styles.assistantMessage}>
      <div className={styles.assistantMeta}>
        <span className={styles.assistantDot} aria-hidden="true" />
        <strong>Hilo Cofrade</strong>
        <span>{response.semantic?.used ? 'Síntesis semántica · datos verificados' : 'Respuesta documentada'}</span>
      </div>

      <p className={styles.answerText}>{response.answer}</p>

      {!isGraphPath && (response.path || []).length > 0 ? (
        <div className={styles.answerPath} aria-label={`Ruta: ${response.path.join(', ')}`}>
          {response.path.map((step, index) => (
            <span key={`${message.id}-${step}`}>{index ? '→ ' : ''}{step}</span>
          ))}
        </div>
      ) : null}

      {isGraphPath && !compact ? (
        <HiloGraphPath response={response} />
      ) : hasItems ? (
        <div className={styles.answerList}>
          {visibleItems.map((item, index) => (
            <AnswerListItem item={item} index={index} key={`${item.label}-${index}`} />
          ))}
        </div>
      ) : null}

      {hasEntities && (!isGraphPath || compact) ? (
        <div className={styles.answerEntities} aria-label="Entidades relacionadas">
          {visibleEntities.map((entity) => entity.href ? (
            <Link href={entity.href} key={entity.id} className={styles.entityChip}>
              <span>{entity.type}</span>
              <strong>{entity.name}</strong>
            </Link>
          ) : (
            <span className={styles.entityChip} key={entity.id}>
              <span>{entity.type}</span>
              <strong>{entity.name}</strong>
            </span>
          ))}
        </div>
      ) : null}

      {!compact ? <HiloEvidence items={response.evidence || []} /> : null}
      {!compact ? <HiloReferences items={response.references || []} note={response.referencesNote || ''} /> : null}

      {!compact && (response.followUps || []).length > 0 ? (
        <div className={styles.followUps}>
          <span>También puedes preguntar</span>
          <div>
            {response.followUps.slice(0, 3).map((question) => (
              <button type="button" key={question} onClick={() => onFollowUp(question)}>{question}</button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function HiloSearch({
  fullPage = false,
  initialQuestion = '',
  homeCompact = false,
  universal = false,
  onNavigate,
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [messages, setMessages] = useState([]);
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const sequence = useRef(0);
  const initialHandled = useRef(false);
  const compact = homeCompact && !fullPage;
  const searchOrigin = universal ? 'global_search' : fullPage ? 'conversation_search' : 'home_search';
  const orderedResults = prioritizeHiloNavigationItems(results);

  useEffect(() => {
    try {
      const restored = decodeTiraSession(window.sessionStorage.getItem(TIRA_SESSION_KEY) || '');
      if (restored.messages.length) {
        setMessages(restored.messages);
        sequence.current = restored.messages.length + 1;
      }
      if (restored.context) setContext(restored.context);
    } catch (error) {
      console.error('[Hilo Cofrade] No se pudo restaurar la sesión de Tira del hilo', error);
    } finally {
      setSessionReady(true);
    }
  }, []);

  useEffect(() => {
    if (!sessionReady) return;
    try {
      if (!messages.length && !context) {
        window.sessionStorage.removeItem(TIRA_SESSION_KEY);
      } else {
        window.sessionStorage.setItem(TIRA_SESSION_KEY, encodeTiraSession({ messages, context }));
      }
    } catch (error) {
      console.error('[Hilo Cofrade] No se pudo guardar la sesión de Tira del hilo', error);
    }
  }, [messages, context, sessionReady]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2 || looksLikeQuestion(query)) {
      setResults([]);
      setSearching(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const request = await fetch(`/api/tira-del-hilo/search?q=${encodeURIComponent(term)}`, {
          method: 'GET',
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        const payload = await request.json();
        if (!request.ok) throw new Error(payload?.error || 'No se pudo buscar');
        setResults(Array.isArray(payload?.items) ? payload.items : []);
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('[Hilo Cofrade] Error en autocompletado', error);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const navigateTo = (href) => {
    if (!href) return;
    onNavigate?.();
    router.push(href);
  };

  const ask = async (value) => {
    const question = String(value || query).trim();
    if (!question || loading) return;

    const questionKey = hiloEntityKey(question);
    const exactNavigation = orderedResults.find((item) => item.href && hiloEntityKey(item.title) === questionKey);
    const exact = exactNavigation || results.find((item) => normalize(item.title) === normalize(question));
    if (exact?.href && !looksLikeQuestion(question)) {
      navigateTo(exact.href);
      return;
    }

    const stamp = Date.now();
    const userId = `u-${stamp}-${++sequence.current}`;
    const assistantId = `a-${stamp}-${++sequence.current}`;
    setMessages((current) => [...current, { id: userId, role: 'user', text: question }]);
    setQuery('');
    setResults([]);
    setLoading(true);

    try {
      const request = await fetch('/api/tira-del-hilo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context }),
      });
      const response = await request.json();

      if (!request.ok && response?.error) throw new Error(response.error);

      setMessages((current) => [...current, { id: assistantId, role: 'assistant', response }]);
      if (Object.prototype.hasOwnProperty.call(response || {}, 'context')) {
        setContext(response?.context || null);
      }
    } catch (error) {
      setMessages((current) => [...current, {
        id: assistantId,
        role: 'assistant',
        response: {
          kind: 'not_documented',
          answer: 'No he podido resolver esa consulta ahora mismo. Prefiero no completar la respuesta con información no documentada.',
          path: [],
          entities: [],
          items: [],
          followUps: [],
        },
      }]);
      console.error('[Hilo Cofrade] Error al consultar Tira del hilo', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const firstQuestion = String(initialQuestion || '').trim().slice(0, 320);
    if (!sessionReady || initialHandled.current || !firstQuestion || messages.length || loading) return;
    initialHandled.current = true;
    void ask(firstQuestion);
  }, [initialQuestion, sessionReady, messages.length, loading]);

  const submit = (event) => {
    event.preventDefault();
    ask(query);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      ask(query);
    }
  };

  const useResult = (item) => {
    if (item.href) {
      navigateTo(item.href);
      return;
    }
    ask(`Cuéntame sobre ${item.title}`);
  };

  const resetConversation = () => {
    setMessages([]);
    setContext(null);
    setQuery('');
    setResults([]);
    setSearching(false);
    initialHandled.current = true;
    try {
      window.sessionStorage.removeItem(TIRA_SESSION_KEY);
    } catch {}
  };

  const hasConversation = messages.length > 0;
  const activeContextLabel = contextLabel(context);
  const visibleMessages = compact ? messages.slice(-2) : messages;
  const showComposer = !hasConversation || !compact;
  const composerLabel = universal ? 'Busca una ficha o pregunta a Hilo Cofrade' : 'Pregunta a Hilo Cofrade';
  const composerPlaceholder = activeContextLabel
    ? `Sigue preguntando sobre ${activeContextLabel}…`
    : universal
      ? 'Busca una ficha o pregunta sobre hermandades, imágenes, pasos, bandas, marchas…'
      : 'Pregunta sobre hermandades, imágenes, pasos, bandas, marchas, autores…';

  return (
    <div className={`${styles.wrap} ${fullPage ? styles.fullMode : ''}`} data-hilo-section={fullPage ? 'conversation_search' : 'home_search'}>
      {hasConversation ? (
        <div className={styles.conversation} aria-live="polite">
          {visibleMessages.map((message) => message.role === 'user' ? (
            <div className={styles.userMessage} key={message.id}>
              <span>Tú</span>
              <p>{message.text}</p>
            </div>
          ) : (
            <AssistantAnswer message={message} key={message.id} onFollowUp={ask} compact={compact} />
          ))}
          {loading ? (
            <div className={`${styles.assistantMessage} ${styles.loadingMessage}`}>
              <div className={styles.assistantMeta}>
                <span className={styles.assistantDot} aria-hidden="true" />
                <strong>Hilo Cofrade</strong>
              </div>
              <div className={styles.typing} aria-label="Consultando el grafo"><span /><span /><span /></div>
            </div>
          ) : null}
        </div>
      ) : null}

      {hasConversation ? (
        <div className={styles.contextToolbar}>
          {activeContextLabel ? (
            <span className={styles.contextPill}><i aria-hidden="true" />Siguiendo · {activeContextLabel}</span>
          ) : <span />}
          <button type="button" onClick={resetConversation} disabled={loading}>Nueva consulta</button>
        </div>
      ) : null}

      {showComposer ? (
        <form
          className={`${styles.form} ${hasConversation ? styles.formAfterConversation : ''}`}
          onSubmit={submit}
          data-hilo-event="hilo_search"
          data-hilo-origin={universal ? 'global_form' : fullPage ? 'conversation_form' : 'form'}
        >
          <label className={styles.srOnly} htmlFor={fullPage ? 'hilo-search-full' : 'hilo-search'}>{composerLabel}</label>
          <textarea
            id={fullPage ? 'hilo-search-full' : 'hilo-search'}
            rows={1}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={composerPlaceholder}
            autoComplete="off"
            disabled={loading}
          />
          <button type="submit" aria-label="Enviar pregunta" disabled={loading || !query.trim()}>
            <span aria-hidden="true">↑</span>
          </button>
        </form>
      ) : null}

      {!hasConversation && !query.trim() ? (
        <div className={styles.suggestions} aria-label="Preguntas sugeridas">
          {starterQuestions.map((question) => (
            <button
              type="button"
              key={question}
              onClick={() => ask(question)}
              data-hilo-event="hilo_search"
              data-hilo-origin="suggestion"
              data-hilo-outcome="question"
            >{question}</button>
          ))}
        </div>
      ) : null}

      {showComposer && query.trim().length > 1 && !looksLikeQuestion(query) && (results.length > 0 || searching) ? (
        <div className={styles.results} aria-label="Fichas y coincidencias del grafo" aria-live="polite">
          <div className={styles.resultsHead}>
            <span>{searching ? 'Buscando…' : 'Fichas y coincidencias'}</span>
            <small>Abre una ficha directamente o sigue tirando del hilo</small>
          </div>
          <div className={styles.resultsList}>
            {orderedResults.map((item, index) => item.href ? (
              <Link
                href={item.href}
                className={`${styles.result} ${index === 0 ? styles.resultPrimary : ''}`}
                key={`${item.entityId || item.type}-${item.title}`}
                onClick={onNavigate}
                data-hilo-event="search_result_open"
                data-hilo-origin={searchOrigin}
                data-hilo-target-type={analyticsEntityType(item.type)}
              >
                <SearchResultContent item={item} />
              </Link>
            ) : (
              <button
                type="button"
                className={`${styles.result} ${styles.resultQuestion}`}
                key={`${item.entityId || item.type}-${item.title}`}
                onClick={() => useResult(item)}
                data-hilo-event="search_result_ask"
                data-hilo-origin={searchOrigin}
                data-hilo-target-type={analyticsEntityType(item.type)}
              >
                <SearchResultContent item={item} />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {!fullPage ? (
        <Link className={styles.expandLink} href="/pregunta">
          <span>{compact && hasConversation ? 'Seguir conversando y ver todas las fuentes' : 'Abrir conversación completa'}</span>
          <b aria-hidden="true">↗</b>
        </Link>
      ) : null}

      {hasConversation ? (
        <div className={styles.disclaimer}>
          <span aria-hidden="true">●</span>
          Responde solo con relaciones y datos publicados en Hilo Cofrade. Si falta información, lo indica.
        </div>
      ) : null}
    </div>
  );
}
