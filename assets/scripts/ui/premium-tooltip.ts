export function initPremiumTooltips(): void {
    const selector = '.music-player__track-premium';
    let trigger: HTMLElement | null = null;
    let tooltip: HTMLElement | null = null;

    function hide(): void {
        if (!tooltip || !trigger) return;
        tooltip.hidden = true;
        trigger.append(tooltip);
        tooltip = null;
        trigger = null;
    }

    function position(): void {
        if (!tooltip || !trigger) return;
        const anchor = trigger.getBoundingClientRect();
        const list = trigger.closest('.music-player__playlist')?.getBoundingClientRect();
        if (!trigger.isConnected || (list && (anchor.bottom < list.top || anchor.top > list.bottom))) {
            hide();
            return;
        }

        const { width, height } = tooltip.getBoundingClientRect();
        const gap = 6;
        const margin = 8;
        const left = Math.max(margin, Math.min(anchor.right - width, window.innerWidth - width - margin));
        const below = anchor.bottom + gap;
        const top = below + height <= window.innerHeight - margin ? below : anchor.top - height - gap;
        tooltip.style.left = left + 'px';
        tooltip.style.top = Math.max(margin, top) + 'px';
    }

    function show(event: Event): void {
        if (!(event.target instanceof Element)) return;
        const next = event.target.closest<HTMLElement>(selector);
        if (!next || next === trigger) return;
        const content = next.querySelector<HTMLElement>('[role="tooltip"]');
        if (!content) return;
        hide();
        trigger = next;
        tooltip = content;
        document.body.append(content);
        content.hidden = false;
        position();
    }

    document.addEventListener('pointerover', show);
    document.addEventListener('focusin', show);
    document.addEventListener('pointerout', event => {
        if (!trigger?.contains(event.target as Node) || trigger.contains(event.relatedTarget as Node)) return;
        if (!trigger.contains(document.activeElement)) hide();
    });
    document.addEventListener('focusout', event => {
        if (trigger?.contains(event.target as Node) && !trigger.matches(':hover')) hide();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') hide();
    });
    window.addEventListener('scroll', position, true);
    window.addEventListener('resize', position);
}
