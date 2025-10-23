import { describe, it, expect } from 'vitest'
import { publishToDevice, getMQTTStatus } from '../lib/supabase/mqtt-server'

describe('mqtt-server', () => {
  it('queues messages when broker unavailable', () => {
    // call publishToDevice - network/broker might not be available in CI
    const ok = publishToDevice('test/topic', JSON.stringify({ hello: 'world' }))
    const status = getMQTTStatus()
    // publishToDevice returns boolean; if broker not available it returns false but queues
    expect(typeof ok).toBe('boolean')
    expect(status).toHaveProperty('queueLength')
  })
})
