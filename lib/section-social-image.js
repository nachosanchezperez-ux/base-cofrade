import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { sectionSocialImageConfig, sectionTitleFontSize } from '@/lib/section-social-copy'

export const SECTION_SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 }

// Open Sans es la tipografía de la web (app/typography.css). Los ficheros son
// un recorte a caracteres latinos (≈26 KB cada uno) para no cargar el
// repositorio; licencia en assets/og-fonts/OFL.txt.
const FONT_FILES = [
  { file: 'OpenSans-Regular.ttf', weight: 400 },
  { file: 'OpenSans-SemiBold.ttf', weight: 600 },
  { file: 'OpenSans-ExtraBold.ttf', weight: 800 },
]

let fontsPromise

function loadFonts() {
  fontsPromise ||= Promise.all(
    FONT_FILES.map(async ({ file, weight }) => ({
      name: 'Open Sans',
      data: await readFile(join(process.cwd(), 'assets/og-fonts', file)),
      style: 'normal',
      weight,
    }))
  )
  return fontsPromise
}

export function sectionSocialImageAlt(key) {
  return sectionSocialImageConfig(key).alt
}

// Pentagrama de la imagen de Crucetas: cinco líneas que salen por la derecha y
// una frase de notas. Todo en el blanco suave del tema; el rojo sigue
// reservado al hilo de la marca.
const STAFF = { left: 700, top: 132, gap: 34, lines: 5 }
const STAFF_NOTES = [
  { x: 760, step: 6 }, { x: 840, step: 4 }, { x: 920, step: 5 },
  { x: 1000, step: 2 }, { x: 1080, step: 3 }, { x: 1160, step: 1 },
]

function StaffMotif({ colors }) {
  const noteSize = STAFF.gap - 4
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex' }}>
      {Array.from({ length: STAFF.lines }, (_, index) => (
        <div
          key={`line-${index}`}
          style={{
            position: 'absolute',
            left: STAFF.left,
            right: 0,
            top: STAFF.top + index * STAFF.gap,
            height: 3,
            display: 'flex',
            background: colors.soft,
            opacity: 0.22,
          }}
        />
      ))}
      {STAFF_NOTES.map((note) => {
        // step: posición en medios espacios desde la línea superior.
        const centerY = STAFF.top + (note.step * STAFF.gap) / 2
        return (
          <div key={`note-${note.x}`} style={{ position: 'absolute', left: note.x, top: centerY - 96, width: noteSize + 4, height: 96 + noteSize / 2, display: 'flex' }}>
            <div style={{ position: 'absolute', right: 0, top: 0, width: 4, height: 96, display: 'flex', background: colors.soft, opacity: 0.55 }} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: noteSize + 4,
                height: noteSize,
                display: 'flex',
                borderRadius: 999,
                background: colors.soft,
                opacity: 0.55,
                transform: 'rotate(-20deg)',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export async function renderSectionSocialImage(key) {
  const { kicker, title, subtitle, colors, motif } = sectionSocialImageConfig(key)
  const titleSize = sectionTitleFontSize(title)
  const fonts = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          padding: '74px 80px 0',
          background: colors.background,
          color: colors.ink,
          fontFamily: 'Open Sans',
        }}
      >
        {motif === 'staff' ? <StaffMotif colors={colors} /> : null}
        <div
          style={{
            display: 'flex',
            color: colors.soft,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: title.length === 1 ? 44 : 24,
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: -2,
          }}
        >
          {title.map((line) => (
            <div key={line} style={{ display: 'flex' }}>{line}</div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 26,
            color: colors.soft,
            fontSize: 34,
            fontWeight: 600,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 68,
            right: 80,
            bottom: 66,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', width: 28, height: 28, borderRadius: 999, background: colors.accent }} />
          <div style={{ display: 'flex', flexGrow: 1, height: 8, background: colors.accent }} />
          <div style={{ display: 'flex', width: 28, height: 28, borderRadius: 999, background: colors.accent }} />
          <div style={{ display: 'flex', alignItems: 'baseline', marginLeft: 46, fontSize: 40, color: colors.ink }}>
            <span style={{ fontWeight: 800 }}>Hilo</span>
            <span style={{ fontWeight: 400, marginLeft: 11 }}>Cofrade</span>
          </div>
        </div>
      </div>
    ),
    { ...SECTION_SOCIAL_IMAGE_SIZE, fonts }
  )
}
