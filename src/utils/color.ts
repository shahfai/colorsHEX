export function generateRandomColor(isHardMode: boolean = true): string {
    if (isHardMode) {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    } else {
        const letters = ['0', '8', 'F'];
        let color = '#';
        for (let i = 0; i < 3; i++) {
            color += letters[Math.floor(Math.random() * letters.length)] + '0';
        }
        return color;
    }
}

export function isValidHex(hex: string): boolean {
    // Check for # and either 3 or 6 hex digits
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

export function hexToRgb(hex: string): [number, number, number] | null {
    if (!isValidHex(hex)) return null;

    let cleanHex = hex.replace('#', '');

    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(char => char + char).join('');
    }

    const num = parseInt(cleanHex, 16);
    return [num >> 16, (num >> 8) & 255, num & 255];
}

/**
 * Calculate similarity between 2 colors out of 10.
 * 0 = completely different (e.g., black vs white)
 * 10 = identical
 */
export function calculateColorScore(targetUserHex: string, guessUserHex: string): number {
    const targetObj = hexToRgb(targetUserHex);
    const guessObj = hexToRgb(guessUserHex);

    if (!targetObj || !guessObj) return 0;

    const rDiff = targetObj[0] - guessObj[0];
    const gDiff = targetObj[1] - guessObj[1];
    const bDiff = targetObj[2] - guessObj[2];

    // Euclidean distance in RGB space
    const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);

    // Max distance is sqrt(255^2 + 255^2 + 255^2) ≈ 441.67
    const maxDistance = 441.6729559300637;

    // Percentage similarity (0 to 1)
    const similarity = Math.max(0, 1 - (distance / maxDistance));

    // Score out of 10
    const score = similarity * 10;

    // Round to 2 decimal places
    return Math.round(score * 100) / 100;
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } {
    const rgb = hexToRgb(hex);
    if (!rgb) return { h: 0, s: 0, v: 0 };
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (max !== min) {
        if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0);
        } else if (max === g) {
            h = (b - r) / d + 2;
        } else if (max === b) {
            h = (r - g) / d + 4;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}
