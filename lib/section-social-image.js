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

export async function renderSectionSocialImage(key) {
  const { kicker, title, subtitle, colors } = sectionSocialImageConfig(key)
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
