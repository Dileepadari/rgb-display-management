export interface SceneElement {
  id: string
  type: "text" | "image" | "clock" | "weather" | "scroll-text" | "animation"
  x: number
  y: number
  width: number
  height: number
  content?: string
  color?: string
  fontSize?: number
  rotation?: number
  opacity?: number
  animation?: string
  duration?: number
  speed?: number
}

export interface SceneConfig {
  id: string
  name: string
  description?: string
  panelCols: number
  panelRows: number
  elements: SceneElement[]
  duration: number // seconds
  loop: boolean
  createdAt: string
  updatedAt: string
  tags?: string[]
}

class SceneConfigManager {
  private scenes: Map<string, SceneConfig> = new Map()
  private listeners: ((scene: SceneConfig, action: "create" | "update" | "delete") => void)[] = []

  createScene(name: string, panelCols: number, panelRows: number): SceneConfig {
    const scene: SceneConfig = {
      id: `scene-${Date.now()}`,
      name,
      description: "",
      panelCols,
      panelRows,
      elements: [],
      duration: 10,
      loop: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    }
    this.scenes.set(scene.id, scene)
    this.notifyListeners(scene, "create")
    console.log("[v0] Scene created:", scene.id)
    return scene
  }

  updateScene(sceneId: string, updates: Partial<SceneConfig>): SceneConfig | null {
    const scene = this.scenes.get(sceneId)
    if (!scene) return null

    const updated: SceneConfig = {
      ...scene,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.scenes.set(sceneId, updated)
    this.notifyListeners(updated, "update")
    console.log("[v0] Scene updated:", sceneId)
    return updated
  }

  getScene(sceneId: string): SceneConfig | null {
    return this.scenes.get(sceneId) || null
  }

  getAllScenes(): SceneConfig[] {
    return Array.from(this.scenes.values())
  }

  deleteScene(sceneId: string): boolean {
    const scene = this.scenes.get(sceneId)
    if (!scene) return false

    this.scenes.delete(sceneId)
    this.notifyListeners(scene, "delete")
    console.log("[v0] Scene deleted:", sceneId)
    return true
  }

  addElement(sceneId: string, element: SceneElement): SceneConfig | null {
    const scene = this.scenes.get(sceneId)
    if (!scene) return null

    scene.elements.push(element)
    return this.updateScene(sceneId, { elements: scene.elements })
  }

  updateElement(sceneId: string, elementId: string, updates: Partial<SceneElement>): SceneConfig | null {
    const scene = this.scenes.get(sceneId)
    if (!scene) return null

    const elementIndex = scene.elements.findIndex((el) => el.id === elementId)
    if (elementIndex === -1) return null

    scene.elements[elementIndex] = { ...scene.elements[elementIndex], ...updates }
    return this.updateScene(sceneId, { elements: scene.elements })
  }

  deleteElement(sceneId: string, elementId: string): SceneConfig | null {
    const scene = this.scenes.get(sceneId)
    if (!scene) return null

    scene.elements = scene.elements.filter((el) => el.id !== elementId)
    return this.updateScene(sceneId, { elements: scene.elements })
  }

  duplicateScene(sceneId: string): SceneConfig | null {
    const scene = this.scenes.get(sceneId)
    if (!scene) return null

    const duplicated: SceneConfig = {
      ...scene,
      id: `scene-${Date.now()}`,
      name: `${scene.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.scenes.set(duplicated.id, duplicated)
    this.notifyListeners(duplicated, "create")
    return duplicated
  }

  searchScenes(query: string): SceneConfig[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.scenes.values()).filter(
      (scene) =>
        scene.name.toLowerCase().includes(lowerQuery) ||
        scene.description?.toLowerCase().includes(lowerQuery) ||
        scene.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    )
  }

  onSceneChange(listener: (scene: SceneConfig, action: "create" | "update" | "delete") => void) {
    this.listeners.push(listener)
  }

  private notifyListeners(scene: SceneConfig, action: "create" | "update" | "delete") {
    this.listeners.forEach((listener) => listener(scene, action))
  }

  exportScene(sceneId: string): string | null {
    const scene = this.scenes.get(sceneId)
    if (!scene) return null
    return JSON.stringify(scene, null, 2)
  }

  importScene(jsonData: string): SceneConfig | null {
    try {
      const scene = JSON.parse(jsonData) as SceneConfig
      scene.id = `scene-${Date.now()}`
      scene.createdAt = new Date().toISOString()
      scene.updatedAt = new Date().toISOString()
      this.scenes.set(scene.id, scene)
      this.notifyListeners(scene, "create")
      return scene
    } catch (error) {
      console.error("[v0] Failed to import scene:", error)
      return null
    }
  }
}

export const sceneConfigManager = new SceneConfigManager()
