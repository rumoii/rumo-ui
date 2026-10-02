[toc]

## SortableCard

Dash layout component: a card shell with a drag handle. Press and hold the handle to reorder; implemented with native mouse/touch pointer events and no drag-and-drop library. The component owns the drag interaction and visual feedback only — the sorted array is maintained by the consumer. Under `v-for`, pass the current position via `index`; `move` reports `(fromIndex, toIndex)` when the card is dropped in a new slot.

### Basic usage

A single card already shows the handle and body; `header` / default slots split the areas. The handle sits at the top center and only a press on it starts a drag.
:::demo
```html
<div class="rumo-dash">
  <rumo-sortable-card style="max-width: 360px;">
    <template slot="header">Revenue trend</template>
    <div style="height: 72px; display: flex; align-items: flex-end; gap: 6px;">
      <div v-for="(h, i) in bars" :key="i" :style="{ flex: '1', height: h + '%', background: 'var(--rumo-c-accent, #856AF9)', borderRadius: '3px' }"></div>
    </div>
  </rumo-sortable-card>
</div>
<script>
  export default {
    data: function() {
      return { bars: [40, 62, 48, 80, 56, 72, 90] };
    }
  };
</script>
```
:::

### Draggable card group

Render several cards with `v-for`, pass `index` per card, and reorder the array on `move`. Cards in between make room while dragging; the consumer applies the final order on drop.
:::demo
```html
<div class="rumo-dash">
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;">
    <rumo-sortable-card
      v-for="(card, idx) in cards"
      :key="card.id"
      :index="idx"
      @move="onMove"
    >
      <template slot="header">{{ card.title }}</template>
      <div style="color: var(--rumo-c-neutral-600, #505564); font-size: 12px;">
        {{ card.desc }}
      </div>
    </rumo-sortable-card>
  </div>
</div>
<script>
  export default {
    data: function() {
      return {
        cards: [
          { id: 'a', title: 'Traffic sources', desc: 'Visits split by channel' },
          { id: 'b', title: 'Conversion funnel', desc: 'Drop-off from visit to purchase' },
          { id: 'c', title: 'Retention curve', desc: 'New-user retention over 8 weeks' },
          { id: 'd', title: 'Revenue mix', desc: 'Subscription, one-off and add-ons' }
        ]
      };
    },
    methods: {
      onMove(from, to) {
        if (from === to) return;
        var next = this.cards.slice();
        var moved = next.splice(from, 1)[0];
        next.splice(to, 0, moved);
        this.cards = next;
      }
    }
  };
</script>
```
:::

### Custom handle & disabled

The `handle` slot replaces the default grip. With `handle` set to `false` and no handle slot, the drag handle is not rendered. `disabled` turns dragging off.
:::demo
```html
<div class="rumo-dash">
  <rumo-sortable-card style="max-width: 360px; margin-bottom: 12px;">
    <template slot="header">Custom handle</template>
    <template slot="handle">≡</template>
    <div style="color: var(--rumo-c-neutral-600, #505564); font-size: 12px;">
      Handle content is fully replaced by the slot; drag behavior is unchanged.
    </div>
  </rumo-sortable-card>

  <rumo-sortable-card :disabled="true" style="max-width: 360px;">
    <template slot="header">Locked</template>
    <div style="color: var(--rumo-c-neutral-600, #505564); font-size: 12px;">
      With `disabled` the handle is dimmed and drag is ignored.
    </div>
  </rumo-sortable-card>
</div>
```
:::

### Attributes
| Attribute | Description | Type | Options | Default |
|---|---|---|---|---|
| index | Current index in the consumer list; the `from` basis of `move` | number | — | 0 |
| disabled | Disable dragging | boolean | — | false |
| handle | Whether the drag handle is rendered | boolean | — | true |

### Events
| Event | Description | Arguments |
|---|---|---|
| move | Fired when the card is dropped in a new slot | `(fromIndex, toIndex)` |
| drag-start | Fired when a drag starts from the handle | — |
| drag-end | Fired when the drag ends (release or cancel) | — |

### Slots
| Name | Description |
|---|---|
| handle | Custom handle content; defaults to a six-dot grip |
| header | Card header area |
| default | Card body |
