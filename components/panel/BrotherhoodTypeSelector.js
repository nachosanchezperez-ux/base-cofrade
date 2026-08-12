'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from '@/app/panel/panel.module.css'

const TYPES = [
  { name: 'Penitencia', icon: '/iconos/hermandades/penitencia.png' },
  { name: 'Gloria', icon: '/iconos/hermandades/gloria.png' },
  { name: 'Sacramental', icon: '/iconos/hermandades/sacramental.png' },
]

export default function BrotherhoodTypeSelector({ selected = [] }) {
  const initialTypes = TYPES.map(({ name }) => name).filter((type) =>
    selected.some((item) => String(item).toLowerCase() === type.toLowerCase())
  )
  const [types, setTypes] = useState(initialTypes)

  function toggleType(type) {
    setTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    )
  }

  return (
    <fieldset className={`${styles.typeFieldset} ${styles.fieldWide}`}>
      <legend>Tipos de hermandad</legend>
      <p>Selecciona una, dos o las tres opciones.</p>
      <div className={styles.typeOptions}>
        {TYPES.map(({ name, icon }, index) => {
          const checked = types.includes(name)
          return (
            <label className={checked ? styles.typeOptionSelected : ''} key={name}>
              <input
                name="brotherhood_types"
                type="checkbox"
                value={name}
                checked={checked}
                required={types.length === 0 && index === 0}
                onChange={() => toggleType(name)}
              />
              <span className={styles.typeOptionIcon}>
                <Image src={icon} alt="" width={38} height={38} />
              </span>
              <strong>{name}</strong>
              <small>{checked ? 'Seleccionada' : 'Seleccionar'}</small>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
