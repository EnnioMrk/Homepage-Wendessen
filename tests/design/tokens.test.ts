import { describe, expect, test } from 'bun:test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The design system is CSS custom properties. A token defined as a reference to
 * itself is silently invalid: the browser drops the declaration and every
 * border, hover colour or divider that uses it disappears without an error.
 * This test failed to exist once; five tokens were self-referential in the
 * build and no screenshot or contrast audit noticed.
 */
const DESIGN_DIR = join(process.cwd(), 'app', 'design');
const files = readdirSync(DESIGN_DIR).filter((f) => f.endsWith('.css'));

const css = files
    .map((f) => readFileSync(join(DESIGN_DIR, f), 'utf8'))
    .join('\n');

const defined = new Set<string>();
const used = new Set<string>();
const selfReferential: string[] = [];

const declaration = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
let match: RegExpExecArray | null;
while ((match = declaration.exec(css))) {
    const [, name, value] = match;
    defined.add(name);
    if (new RegExp(`^\\s*var\\(\\s*${name}\\s*\\)\\s*$`).test(value)) {
        selfReferential.push(name);
    }
    for (const ref of value.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
        used.add(ref[1]);
    }
}

// Values consumed by inline styles and class attributes in components.
const componentSources = [
    'app/components/register',
    'app/components/admin',
    'app/design',
];
for (const dir of componentSources) {
    const walk = (path: string) => {
        for (const entry of readdirSync(path, { withFileTypes: true })) {
            const full = join(path, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (/\.(tsx|ts)$/.test(entry.name)) {
                const source = readFileSync(full, 'utf8');
                for (const ref of source.matchAll(
                    /var\(\s*(--[a-z0-9-]+)/gi,
                )) {
                    used.add(ref[1]);
                }
            }
        }
    };
    walk(dir);
}

describe('design tokens', () => {
    test('every token is defined', () => {
        expect(defined.size).toBeGreaterThan(40);
    });

    test('no token refers to itself', () => {
        expect(selfReferential).toEqual([]);
    });

    // Re-declaring a token inside a media query is legitimate (the register's
    // margin and type ramp shrink on small screens), so duplicates are not an
    // error by themselves.

    test('every var() reference resolves to a defined token', () => {
        const missing = [...used].filter((name) => !defined.has(name));
        expect(missing).toEqual([]);
    });

    test('the world keeps its flat geometry', () => {
        expect(/border-radius:\s*(?!0|50%)[1-9]/.test(css)).toBe(false);
        // The register is flat: a shadow is either none, an inset printed-mark
        // rule, or the focus ring. A drop shadow anywhere is a defect.
        const shadows = [...css.matchAll(/box-shadow:\s*([^;]+);/g)].map(
            (m) => m[1].trim(),
        );
        const forbidden = shadows.filter(
            (value) => !/^(inset|none|var\(--focus-ring)/.test(value),
        );
        expect(forbidden).toEqual([]);
    });
});
