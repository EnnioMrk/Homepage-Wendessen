# **Complete AI Design Guidelines: What to Avoid to Not Look Like AI**

## **TYPOGRAPHY & FONT SYSTEM**

### ❌ **What Screams "AI"**
- Default Inter or system fonts with no customization
- Uniform font weights across all text
- Predictable font pairings (e.g., Inter Bold for headers everywhere)
- No typographic hierarchy variation
- Centered text for body content (amateurish)

### ✅ **What Actually Works**
- **Use intentional font pairings** beyond the defaults
  - Pair serif with sans-serif meaningfully
  - Use unusual but readable combinations
  - Match font personality to brand voice
  
- **Vary typography systematically**
  - Different weights for visual hierarchy
  - Irregular line-heights for depth
  - Unexpected font sizes for emphasis
  
- **Typography has personality**
  - Geometric fonts feel modern and tech-forward
  - Humanist sans-serifs feel warm and approachable
  - Serif fonts convey tradition or sophistication
  - Match this to your actual brand

- **Break typographic predictability**
  - Use custom letter-spacing (tracking)
  - Align text left (not always centered)
  - Create contrast with size, not just weight

**Example:** Instead of "Arial Bold for everything important," use a serif font for headlines, a humanist sans-serif for body, and a condensed geometric sans for accent text. This requires intentional decision-making, which AI defaults don't provide. [youtube](https://www.youtube.com/watch?v=dXdxVi6Qz6k)

***

## **COLOR SYSTEMS**

### ❌ **What Screams "AI"**
- Pre-built color palettes applied exactly as-is
- Using trendy 2024 colors (dusty rose + sage green everywhere)
- No contrast variation between light/dark sections
- Generic "modern" teal/blue as primary color
- Gradients as filler (especially mesh gradients without purpose)
- Colors that don't match brand guidelines

### ✅ **What Actually Works**
- **Define a custom color system BEFORE design**
  - Don't let AI generate colors; you define them
  - Use tools like Aura to create unique, consistent themes [youtube](https://www.youtube.com/watch?v=dXdxVi6Qz6k)
  - Create explicit rules for when each color is used
  - Consider accessibility (4.5:1 contrast minimum for text)

- **Use colors intentionally**
  - Primary color for CTAs only (not scattered everywhere)
  - Secondary/accent colors for specific UI patterns
  - Neutral palette for text and backgrounds
  - Each color must serve a purpose

- **Break template color trends**
  - Avoid the "2025 SaaS color palette" (dusty tones everywhere)
  - Use bold, unexpected colors if they fit your brand
  - Create custom color combinations not seen in 100 other AI sites

- **Depth through color, not just shadows**
  - Use background colors to create hierarchy
  - Slightly desaturated colors for secondary sections
  - Rich, saturated colors for important elements

**Actionable step:** Extract real brand CSS from companies you admire (e.g., Zapier, Stripe) and study their color rules, then adapt to your own. [youtube](https://www.youtube.com/watch?v=5iEQNsecHpI)

***

## **LAYOUT & INFORMATION ARCHITECTURE**

### ❌ **What Screams "AI"**
- Hero section → 3-column feature cards → CTA footer (EVERY site)
- All sections the same height and width
- Identical spacing between elements (4px grid everywhere)
- No white space strategy—just padding numbers
- Features arranged left-to-right/top-to-bottom with no logic
- Navigation floating at top with search bar and contact (template standard)

### ✅ **What Actually Works**
- **Design with intentional user flows**
  - Ask: "What does the user need at each stage?"
  - Don't just follow template sections
  - Information architecture should solve problems, not fill space

- **Break symmetry deliberately**
  - Asymmetrical layouts feel more thoughtful
  - Vary column counts (not always 3-column)
  - Different heights for different sections

- **Strategic whitespace, not default padding**
  - Dense sections for overwhelming features
  - Generous space around important CTAs
  - Visual breathing room creates sophistication

- **Non-linear, intentional arrangements**
  - Zigzag content (image-right, text-left, then switch)
  - Staggered elements at different depths
  - Overlapping sections that break the grid

**Practical approach:** Create your design system first with clear spacing rules, typography scales, and component variations. Then constrain AI to use ONLY that system rather than generating freely. [reddit](https://www.reddit.com/r/vibecoding/comments/1oy2f95/how_do_i_make_an_aigenerated_frontend_not_look/)

***

## **INTERACTIVE ELEMENTS & ANIMATIONS**

### ❌ **What Screams "AI"**
- Animations everywhere (fade-ins, slide-ins, floating elements)
- Glassmorphic cards because "modern"
- Micro-interactions without purpose
- Parallax scrolling as filler
- Every button has a hover animation
- Rotating features carousel (guaranteed)
- Auto-playing video backgrounds

### ✅ **What Actually Works**
- **Animations serve functionality**
  - Move things to draw attention to important changes
  - Provide feedback for user actions
  - Guide the eye toward CTAs
  - Not decoration

- **Restraint in motion**
  - Use animations sparingly
  - Fast, snappy transitions (200-300ms)
  - Only what needs to move moves

- **Interactive depth without cliché**
  - Subtle shadows instead of glassmorphism
  - Hover states that are useful, not flashy
  - Custom animations tied to brand personality

- **Backgrounds and visual interest come from design, not motion**
  - Use Spline or Reactbits for sophisticated interactive elements (not template carousels) [youtube](https://www.youtube.com/watch?v=dXdxVi6Qz6k)
  - Static, high-quality visuals often beat animated gimmicks

***

## **IMAGERY & VISUAL ASSETS**

### ❌ **What Screams "AI"**
- Generic stock photos (smiling people in corporate settings)
- AI-generated images with that characteristic "smoothness"
- Using the same image library everyone else uses (Unsplash defaults)
- Blurry, over-processed images
- Hands doing awkward things
- Perfect, unrealistic product photography
- No human elements or imperfections

### ✅ **What Actually Works**
- **Use REAL assets**
  - Real product screenshots, not mockups
  - Real team photos or diverse, authentic imagery
  - Candid moments over staged photos
  - Brand-specific photography with consistent style

- **High-quality, unique imagery**
  - Custom illustrations (not generic icon packs)
  - Photography that matches your brand voice
  - Layered images with depth, not flat stock

- **Intentional imperfection**
  - Real dust, texture, and grain in images
  - Slight asymmetry in layouts
  - Photos with character, not perfection

- **Replace clichés**
  - Instead of "people in a meeting," show actual product usage
  - Instead of abstract stock photos, use your actual product
  - Instead of generic illustrations, commission custom ones

***

## **DESIGN SYSTEM & CONSISTENCY**

### ❌ **What Screams "AI"**
- No design system—each section looks like it was generated separately
- Wildly inconsistent spacing, sizing, or styling
- Components used differently on different pages
- No clear visual language
- Random border-radius and shadow combinations

### ✅ **What Actually Works**
- **Define design system BEFORE generating** [reddit](https://www.reddit.com/r/vibecoding/comments/1oy2f95/how_do_i_make_an_aigenerated_frontend_not_look/)
  - Color palette with specific use cases
  - Typography scale (h1 through body)
  - Spacing scale (4px, 8px, 12px, 16px, etc.)
  - Component library (buttons, cards, inputs)
  - Border-radius rules (sharper = modern, rounded = friendly)
  - Shadow rules (when to use, how deep)
  - Animation principles

- **Enforce strict design rules**
  - "Primary color used ONLY for primary CTAs"
  - "Section padding always 16px or 32px, never random"
  - "All corners either sharp (0px) or medium (8px), never mixed"
  - Rules prevent the AI randomness

- **System sources for inspiration**
  - Import pre-made design systems from Twecn or similar tools
  - Extract CSS from brands you admire and adapt
  - Use MagicPath to build custom systems [youtube](https://www.youtube.com/watch?v=5iEQNsecHpI)
  - Document everything in a shared style guide

***

## **CONTENT & COPYWRITING VOICE**

### ❌ **What Screams "AI"**
- "Revolutionize the way you..."
- "Cutting-edge," "Unleash," "Unlock the potential"
- "Transforming industries around the world"
- Overly formal, safe, predictable tone
- Robotic transitions: "Furthermore," "Moreover," "In addition"
- All sections follow identical structure/length
- Generic benefit statements with no specificity
- Overuse of buzzwords: "seamless," "powerful," "innovative"

### ✅ **What Actually Works**
- **Specific, unique voice**
  - Opinionated about what you do
  - Specific examples, not vague benefits
  - Personal perspective, not corporate speak
  - Honest about limitations

- **Natural sentence variation**
  - Short sentences. Then longer ones with more detail.
  - Fragment sentences for emphasis.
  - Avoid symmetrical structure across sections

- **Show, don't tell**
  - Instead of: "Our tool is powerful"
  - Say: "Process 10,000 transactions in 3 seconds"
  - Specificity beats adjectives

- **Inject personality**
  - Casual language where appropriate
  - Rhetorical questions and directness
  - Emotional resonance, not just facts
  - Real use cases with actual results

**Red flags to cut:** "Significant milestone," "important to note," "it is important," "the fact that," "in this article," "in today's world". [fomo](https://fomo.ai/ai-resources/the-ultimate-copy-paste-prompt-add-on-to-avoid-overused-words-and-phrases-in-ai-generated-content/)

***

## **ACCESSIBILITY (OFTEN OVERLOOKED, CRITICAL)**

### ❌ **What Screams "AI" (Bad)"**
- Low contrast text (fails WCAG)
- No focus states for keyboard users
- Missing alt text on images
- No semantic HTML
- Unreadable on mobile
- No indication of interactive elements

### ✅ **What Actually Works**
- **Built-in accessibility from the start** [uxtigers](https://www.uxtigers.com/post/ux-roundup-20251222)
  - 4.5:1 contrast minimum for body text
  - 3:1 for large text
  - Clear focus indicators on all interactive elements
  - Keyboard-navigable interface

- **Semantic markup**
  - Proper heading hierarchy
  - Form labels linked to inputs
  - List elements for lists
  - Button elements for buttons

- **Mobile-first responsive design**
  - Text readable without zoom
  - Touch targets 48px minimum
  - No horizontal scrolling

***