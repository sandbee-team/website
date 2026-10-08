import { describe, expect, it } from 'vitest'

import { getStories, getStory, getStoryParams } from './stories'

describe('stories loader', () => {
  it('loads the Electron origin story (the sanctioned launch fixture)', async () => {
    const stories = await getStories()
    expect(stories.map((s) => s.id)).toEqual(['electron-tracking-origin'])
    expect(stories[0].relatedOfferings).toEqual(['electron-tracking'])
  })

  it('resolves by slug and returns undefined for unknown slugs', async () => {
    const story = await getStory('electron-tracking-origin')
    expect(story?.title).toMatch(/desktop tracking/i)
    expect(await getStory('missing')).toBeUndefined()
  })

  it('produces non-empty static params (Cache Components rule)', async () => {
    const params = await getStoryParams()
    expect(params).toEqual([{ story: 'electron-tracking-origin' }])
  })
})
