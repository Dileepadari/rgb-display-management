import mqtt, { MqttClient } from 'mqtt'

type QueuedMessage = { topic: string; message: string; attempts: number }

let client: MqttClient | null = null
let queue: QueuedMessage[] = []
let connecting = false
let reconnectAttempts = 0
const MAX_RECONNECT = 10

function brokerUrl() {
  const broker = process.env.MQTT_BROKER || process.env.NEXT_PUBLIC_MQTT_BROKER || 'mqtt://localhost'
  const port = process.env.MQTT_PORT || process.env.NEXT_PUBLIC_MQTT_PORT || '1883'
  return `${broker}:${port}`
}

function ensureClient() {
  if (client && client.connected) return client
  if (connecting) return client

  connecting = true
  const url = brokerUrl()
  client = mqtt.connect(url, { reconnectPeriod: 1000, connectTimeout: 30_000 })

  client.on('connect', () => {
    console.log('[server-mqtt] connected')
    reconnectAttempts = 0
    connecting = false
    // flush queue
    flushQueue()
  })

  client.on('error', (err) => {
    console.error('[server-mqtt] error', err)
  })

  client.on('close', () => {
    console.log('[server-mqtt] connection closed')
    client = null
    connecting = false
    // schedule reconnect with backoff
    attemptReconnect()
  })

  return client
}

function attemptReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT) {
    console.error('[server-mqtt] max reconnect attempts reached')
    return
  }
  reconnectAttempts++
  const delay = Math.min(30_000, 1000 * Math.pow(2, reconnectAttempts))
  console.log(`[server-mqtt] reconnect in ${delay}ms`)
  setTimeout(() => ensureClient(), delay)
}

function flushQueue() {
  while (queue.length > 0 && client && client.connected) {
    const q = queue.shift()!
    try {
      client.publish(q.topic, q.message, (err) => {
        if (err) {
          console.error('[server-mqtt] publish error', err)
          // re-queue with attempts limit
          q.attempts++
          if (q.attempts < 5) queue.push(q)
        }
      })
    } catch (err) {
      console.error('[server-mqtt] publish exception', err)
      q.attempts++
      if (q.attempts < 5) queue.push(q)
    }
  }
}

export function publishToDevice(topic: string, message: string) {
  try {
    const c = ensureClient()
    if (!c) {
      console.warn('[server-mqtt] queuing message (no client)')
      queue.push({ topic, message, attempts: 0 })
      return false
    }

    if (!c.connected) {
      console.warn('[server-mqtt] client not connected, queuing')
      queue.push({ topic, message, attempts: 0 })
      return false
    }

    c.publish(topic, message, (err) => {
      if (err) {
        console.error('[server-mqtt] publish error', err)
        queue.push({ topic, message, attempts: 1 })
      }
    })
    return true
  } catch (err) {
    console.error('Publish error', err)
    queue.push({ topic, message, attempts: 1 })
    return false
  }
}

export function getMQTTStatus() {
  return {
    connected: !!client && !!client.connected,
    queueLength: queue.length,
    reconnectAttempts,
  }
}
