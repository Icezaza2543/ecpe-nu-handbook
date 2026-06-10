# Dependency Graph Page

## Goal
Upgrade the Dependency Graph to be a highly interactive "Prerequisite Explorer", serving as a flagship feature alongside Visual Maps.

## Key Elements
1. **Modes**:
   - **Readable Mode**: Default, easy to digest.
   - **Graph Explore Mode**: Advanced interactive canvas.
2. **Inspector Drawer**:
   - Detailed view for selected nodes, answering "ถ้าติดวิชานี้ กระทบอะไร" (What happens if I fail this?).
3. **Visual Highlighting**:
   - Highlight critical paths vividly (e.g., using `var(--danger)`).
4. **Tools**:
   - Filter by category, year, or chain.
   - Clear legends and tooltips.
5. **Mobile**:
   - Fallback to a readable/list view if the graph is too complex for small screens.

## Anti-Patterns
- Cluttered graph canvas with overlapping nodes/edges.
- Technical terminology like "Edges" or "Nodes" exposed to the user.
