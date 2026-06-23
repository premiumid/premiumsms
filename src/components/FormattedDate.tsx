/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect } from 'react'

interface FormattedDateProps {
  date: string | Date
  type?: 'datetime' | 'date' | 'time'
}

export default function FormattedDate({ date, type = 'datetime' }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string | null>(null)

  useEffect(() => {
    const d = new Date(date)
    if (isNaN(d.getTime())) {
      setFormatted('N/A')
      return
    }
    if (type === 'datetime') {
      setFormatted(d.toLocaleString())
    } else if (type === 'date') {
      setFormatted(d.toLocaleDateString())
    } else {
      setFormatted(d.toLocaleTimeString())
    }
  }, [date, type])

  if (formatted === null) {
    return <span style={{ opacity: 0.5 }}>...</span>
  }

  if (formatted === 'N/A') {
    return <span>N/A</span>
  }

  return <time dateTime={new Date(date).toISOString()}>{formatted}</time>
}
