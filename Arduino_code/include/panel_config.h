// Physical panel arrangement for THIS specific ESP32.
// Reflash with updated values whenever you physically rearrange panels.
// See ../SETUP.md for the full explanation and a worked example.
#pragma once

// Size of a single physical panel module, in pixels. All panels used together
// must be the same size.
#define PANEL_RES_X 64
#define PANEL_RES_Y 64

// How the panels are arranged as seen from the front, in rows/columns of
// PANEL_RES_X x PANEL_RES_Y modules. Example: 9 panels as a 3x3 square is
// PANEL_GRID_ROWS=3, PANEL_GRID_COLS=3. A single panel is 1x1. A 1x9 strip
// is PANEL_GRID_ROWS=1, PANEL_GRID_COLS=9.
#define PANEL_GRID_ROWS 1
#define PANEL_GRID_COLS 1

// How the daisy-chain physically snakes across that grid, as wired. Panel 1's
// HUB75 OUT feeds panel 2's IN, and so on. CHAIN_TOP_LEFT_DOWN starts at the
// top-left panel and serpentines downward; this is the most common wiring
// for a hand-built grid. See VirtualMatrixPanel_T.hpp's PANEL_CHAIN_TYPE enum
// for the full list of options if you wired it differently.
#define PANEL_CHAIN_TYPE CHAIN_TOP_LEFT_DOWN

// Derived - do not edit.
#define PANEL_CHAIN_LEN (PANEL_GRID_ROWS * PANEL_GRID_COLS)
#define DISPLAY_WIDTH (PANEL_RES_X * PANEL_GRID_COLS)
#define DISPLAY_HEIGHT (PANEL_RES_Y * PANEL_GRID_ROWS)
