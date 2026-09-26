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
import { publicText } from '@/lib/supabase/public-entity-page';
import { trackEvent } from '@/lib/analytics/client';
import styles from './HiloSearch.module.css';
import responseStyles from './HiloSearchResponse.module.css';
import upgradeStyles from './HiloSearchUpgrade.module.css';

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
  cult: 'CU',
  outing: 'SA',
  musical_repertoire: 'CR',
  heritage_update: 'ES',
  band_premiere: '♪',
  directory: 'DIR',
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
  if (type.includes('hermandad')) return 'hermandad';
  if (type.includes('imagen')) return 'imagen';
  if (type.includes('paso')) return 'paso';
  if (type.includes('banda')) return 'banda';
  if (type.includes('marcha')) return 'marcha';
  if (type.includes('autor') || type.includes('profesional') || type.includes('agente')) return 'autor';
  if (type.includes('acontecimiento')) return 'acontecimiento';
  if (type.includes('patrimonio')) return 'patrimonio';
  return 'otro';
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
  const meta = publicText(item.meta);
  const content = (
    <>
      <span>
        <strong>{item.label}</strong>
        {meta ? <small>{meta}</small> : null}
      </span>
      {item.href ? <b aria-hidden="true">→</b> : null}
    </>
  );

  if (item.href && item.external) {
    return (
      <a
        href={item.href}
        className={`${styles.answerListItem} ${responseStyles.safeAnswerItem}`}
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
      <Link href={item.href} className={`${styles.answerListItem} ${responseStyles.safeAnswerItem}`} key={`${item.label}-${index}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`${styles.answerListItem} ${responseStyles.safeAnswerItem}`} key={`${item.label}-${index}`}>
      {content}
    </div>
  );
}

function SearchResultVisual({ item }) {
  const [imageFailed, setImageFailed] = useState(false);
  const visual = item.visual || null;
  const kindClass = visual?.kind === 'identity' ? styles.resultVisualIdentity : styles.resultVisualPhoto;
  const fallbackType = item.entityType || analyticsEntityType(item.type);
  const fallback = searchResultMarks[fallbackType] || 'HC';

  return (
    <span
      className={`${styles.resultVisual} ${visual?.src ? kindClass : styles.resultVisualFallback}`}
      aria-hidden="true"
    >
      {visual?.src && !imageFailed ? (
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
          onError={() => setImageFailed(true)}
        />
      ) : <strong>{fallback}</strong>}
    </span>
  );
}

function SearchResultContent({ item }) {
  const descriptor = publicText(item.descriptor || item.subtitle);
  const location = publicText(item.location);

  return (
    <>
      <SearchResultVisual item={item} />
      <span className={styles.resultCopy}>
        <span className={styles.resultMeta}>
          <span className={styles.resultType}>{item.type}</span>
          {location ? (
            <span className={styles.resultLocation}>
              <i aria-hidden="true" />
              {location}
            </span>
          ) : null}
        </span>
        <strong>{item.title}</strong>
        {descriptor ? <small>{descriptor}</small> : null}
      </span>
      <span className={styles.resultAction}>
        <small>{item.actionLabel || (item.href ? 'Abrir ficha' : 'Preguntar')}</small>
        <span className={styles.arrow} aria-hidden="true">{item.href ? '→' : '↗'}</span>
      </span>
    </>
  );
}

function AssistantAnswer({ message, onFollowUp, compact = false }) {
  const response = message.response || {};
  const publicItems = (response.items || []).filter((item) => publicText(item.label));
  const publicEntities = (response.entities || []).filter((entity) => publicText(entity.name));
  const compactItemLimit = Math.max(1, Math.min(Number(response.compactItemLimit) || 3, 12));
  const visibleItems = compact ? publicItems.slice(0, compactItemLimit) : publicItems;
  const visibleEntities = compact ? publicEntities.slice(0, 3) : publicEntities;
  const itemGroups = visibleItems.reduce((groups, item) => {
    const label = publicText(item.group);
    const key = label || '__ungrouped__';
    if (!groups.has(key)) groups.set(key, { label, items: [] });
    groups.get(key).items.push(item);
    return groups;
  }, new Map());
  const showGroupLabels = itemGroups.size > 1;
  const hasEntities = visibleEntities.length > 0;
  const hasItems = visibleItems.length > 0;
  const isGraphPath = isGraphPathResponse(response);

  return (
    <div className={`${styles.assistantMessage} ${responseStyles.safeAssistant}`}>
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
        <div className={`${styles.answerList} ${responseStyles.groupedList}`}>
          {[...itemGroups.values()].map((group, groupIndex) => (
            <div className={responseStyles.answerListGroup} key={group.label || `group-${groupIndex}`}>
              {showGroupLabels && group.label ? <span className={responseStyles.answerListHeading}>{group.label}</span> : null}
              {group.items.map((item, itemIndex) => (
                <AnswerListItem item={item} index={itemIndex} key={`${item.label}-${itemIndex}`} />
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {(response.links || []).length > 0 ? (
        <div className={responseStyles.answerLinks} aria-label="Directorios relacionados">
          {response.links.map((link) => (
            <Link href={link.href} key={`${link.href}-${link.label}`}>{link.label}<span aria-hidden="true">→</span></Link>
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
  const [searchComplete, setSearchComplete] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const sequence = useRef(0);
  const initialHandled = useRef(false);
  const compact = homeCompact && !fullPage;
  const searchOrigin = universal ? 'global_search' : fullPage ? 'conversation_search' : 'home_search';
  const orderedResults = prioritizeHiloNavigationItems(results);
  const inputId = universal ? 'hilo-search-universal' : fullPage ? 'hilo-search-full' : 'hilo-search';
  const resultsId = `${inputId}-results`;

  const trackSearch = (term, resultsCount = orderedResults.length) => {
    const searchTerm = String(term || '').trim();
    if (!searchTerm) return;
    trackEvent('site_search', {
      search_term: searchTerm,
      results_count: Number(resultsCount) || 0,
    });
  };

  const trackSearchResult = (item, index, term = query, includeSearch = true) => {
    const searchTerm = String(term || '').trim();
    if (includeSearch) trackSearch(searchTerm, orderedResults.length);
    trackEvent('search_result_click', {
      search_term: searchTerm,
      entity_type: analyticsEntityType(item?.type),
      entity_name: item?.title || '',
      position: Number(index) + 1,
    });
  };

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
      setSearchComplete(false);
      setSearchError(false);
      setActiveResultIndex(-1);
      return undefined;
    }

    const controller = new AbortController();
    setSearchComplete(false);
    setSearchError(false);
    setActiveResultIndex(-1);
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
        setSearchError(Boolean(payload?.unavailable));
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('[Hilo Cofrade] Error en autocompletado', error);
          setResults([]);
          setSearchError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
          setSearchComplete(true);
        }
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

  const ask = async (value, { trackSearchEvent = true } = {}) => {
    const question = String(value || query).trim();
    if (!question || loading) return;

    if (trackSearchEvent) trackSearch(question, orderedResults.length);

    const questionKey = hiloEntityKey(question);
    const exactNavigation = orderedResults.find((item) => item.href && hiloEntityKey(item.title) === questionKey);
    const exact = exactNavigation || results.find((item) => normalize(item.title) === normalize(question));
    if (exact?.href && !looksLikeQuestion(question)) {
      const exactIndex = Math.max(0, orderedResults.findIndex((item) => item === exact || item.href === exact.href));
      trackSearchResult(exact, exactIndex, question, false);
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
    if (event.key === 'ArrowDown' && orderedResults.length) {
      event.preventDefault();
      setActiveResultIndex((current) => current >= orderedResults.length - 1 ? 0 : current + 1);
      return;
    }
    if (event.key === 'ArrowUp' && orderedResults.length) {
      event.preventDefault();
      setActiveResultIndex((current) => current <= 0 ? orderedResults.length - 1 : current - 1);
      return;
    }
    if (event.key === 'Escape' && (orderedResults.length || searchComplete)) {
      event.preventDefault();
      setResults([]);
      setSearchComplete(false);
      setSearchError(false);
      setActiveResultIndex(-1);
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const activeResult = orderedResults[activeResultIndex];
      if (activeResult) useResult(activeResult, activeResultIndex);
      else ask(query);
    }
  };

  const useResult = (item, index = orderedResults.indexOf(item)) => {
    if (item.href) {
      trackSearchResult(item, Math.max(0, index), query, true);
      navigateTo(item.href);
      return;
    }
    trackSearch(query, orderedResults.length);
    ask(`Cuéntame sobre ${item.title}`, { trackSearchEvent: false });
  };

  const resetConversation = () => {
    setMessages([]);
    setContext(null);
    setQuery('');
    setResults([]);
    setSearching(false);
    setSearchComplete(false);
    setSearchError(false);
    setActiveResultIndex(-1);
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
    <div className={`${styles.wrap} ${responseStyles.safeWrap} ${fullPage ? styles.fullMode : ''}`} data-hilo-section={fullPage ? 'conversation_search' : 'home_search'}>
      {hasConversation ? (
        <div className={`${styles.conversation} ${responseStyles.safeConversation}`} aria-live="polite" aria-busy={loading}>
          {visibleMessages.map((message) => message.role === 'user' ? (
            <div className={`${styles.userMessage} ${responseStyles.safeUserMessage}`} key={message.id}>
              <span>Tú</span>
              <p>{message.text}</p>
            </div>
          ) : (
            <AssistantAnswer message={message} key={message.id} onFollowUp={ask} compact={compact} />
          ))}
          {loading ? (
            <div className={`${styles.assistantMessage} ${styles.loadingMessage}`} role="status" aria-live="polite">
              <div className={styles.assistantMeta}>
                <span className={styles.assistantDot} aria-hidden="true" />
                <strong>Hilo Cofrade</strong>
              </div>
              <div className={styles.typing} aria-hidden="true"><span /><span /><span /></div>
              <span className={styles.srOnly}>Consultando los datos publicados</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {hasConversation ? (
        <div className={`${styles.contextToolbar} ${responseStyles.safeToolbar}`}>
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
        >
          <label className={styles.srOnly} htmlFor={inputId}>{composerLabel}</label>
          <textarea
            id={inputId}
            rows={1}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={composerPlaceholder}
            autoComplete="off"
            disabled={loading}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={Boolean(query.trim().length > 1 && !looksLikeQuestion(query) && (orderedResults.length || searching || searchComplete))}
            aria-controls={resultsId}
            aria-activedescendant={activeResultIndex >= 0 ? `${inputId}-result-${activeResultIndex}` : undefined}
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
            >{question}</button>
          ))}
        </div>
      ) : null}

      {showComposer && query.trim().length > 1 && !looksLikeQuestion(query) && (results.length > 0 || searching || searchComplete) ? (
        <div className={styles.results} aria-label="Fichas y coincidencias del grafo" aria-live="polite">
          <div className={styles.resultsHead}>
            <span>{searching ? 'Buscando…' : orderedResults.length ? `${orderedResults.length} resultados` : 'Sin coincidencias directas'}</span>
            <small>{orderedResults.length ? 'Fichas, contenidos y listados relacionados' : 'Puedes convertir la búsqueda en una pregunta'}</small>
          </div>
          <div className={styles.resultsList} id={resultsId} role="listbox">
            {orderedResults.map((item, index) => item.href ? (
              <Link
                href={item.href}
                id={`${inputId}-result-${index}`}
                role="option"
                aria-selected={activeResultIndex === index}
                className={`${styles.result} ${index === 0 ? styles.resultPrimary : ''} ${activeResultIndex === index ? upgradeStyles.resultActive : ''}`}
                key={`${item.entityId || item.type}-${item.title}`}
                onClick={() => {
                  trackSearchResult(item, index, query, true);
                  onNavigate?.();
                }}
                onMouseEnter={() => setActiveResultIndex(index)}
                onFocus={() => setActiveResultIndex(index)}
                aria-label={`${item.actionLabel || 'Abrir ficha'}: ${item.title}`}
              >
                <SearchResultContent item={item} />
              </Link>
            ) : (
              <button
                type="button"
                id={`${inputId}-result-${index}`}
                role="option"
                aria-selected={activeResultIndex === index}
                className={`${styles.result} ${styles.resultQuestion} ${activeResultIndex === index ? upgradeStyles.resultActive : ''}`}
                key={`${item.entityId || item.type}-${item.title}`}
                onClick={() => useResult(item)}
                onMouseEnter={() => setActiveResultIndex(index)}
                onFocus={() => setActiveResultIndex(index)}
                aria-label={`Preguntar sobre ${item.title}`}
              >
                <SearchResultContent item={item} />
              </button>
            ))}
            {!searching && !orderedResults.length ? (
              <div className={upgradeStyles.resultsEmpty} role="status">
                <span aria-hidden="true">?</span>
                <div>
                  <strong>{searchError ? 'El buscador directo no está disponible ahora mismo' : 'No encuentro una ficha con esas palabras'}</strong>
                  <small>Hilo Cofrade puede buscar la respuesta dentro de sus relaciones y datos publicados.</small>
                </div>
                <button type="button" onClick={() => ask(query)}>Preguntar</button>
              </div>
            ) : null}
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
