import { HomepageSettings } from '../types';

const decodeMojibakeUtf8 = (value: string): string => {
    try {
        const bytes = Uint8Array.from(Array.from(value).map((char) => char.charCodeAt(0)));
        return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    } catch {
        return value;
    }
};

export const sanitizeArabicText = (value?: string | null): string => {
    if (!value) {
        return '';
    }

    if (!/[ØÙ]/.test(value)) {
        return value;
    }

    const decoded = decodeMojibakeUtf8(value);
    if (decoded && /[\u0600-\u06FF]/.test(decoded)) {
        return decoded;
    }

    return value;
};

export const sanitizeHomepageSettings = (settings: HomepageSettings): HomepageSettings => ({
    ...settings,
    hero: {
        ...settings.hero,
        badgeText: sanitizeArabicText(settings.hero.badgeText),
        titlePrefix: sanitizeArabicText(settings.hero.titlePrefix),
        titleHighlight: sanitizeArabicText(settings.hero.titleHighlight),
        titleSuffix: sanitizeArabicText(settings.hero.titleSuffix),
        description: sanitizeArabicText(settings.hero.description),
        primaryCtaLabel: sanitizeArabicText(settings.hero.primaryCtaLabel),
        secondaryCtaLabel: sanitizeArabicText(settings.hero.secondaryCtaLabel),
        floatingCardTitle: sanitizeArabicText(settings.hero.floatingCardTitle),
        floatingCardSubtitle: sanitizeArabicText(settings.hero.floatingCardSubtitle),
        floatingCardProgressLabel: sanitizeArabicText(settings.hero.floatingCardProgressLabel),
        floatingCardProgressValue: sanitizeArabicText(settings.hero.floatingCardProgressValue),
    },
    stats: settings.stats.map((stat) => ({
        ...stat,
        label: sanitizeArabicText(stat.label),
        manualValue: sanitizeArabicText(stat.manualValue),
    })),
    sections: {
        ...settings.sections,
        featuredCoursesTitle: sanitizeArabicText(settings.sections.featuredCoursesTitle),
        featuredCoursesSubtitle: sanitizeArabicText(settings.sections.featuredCoursesSubtitle),
        featuredArticlesTitle: sanitizeArabicText(settings.sections.featuredArticlesTitle),
        featuredArticlesSubtitle: sanitizeArabicText(settings.sections.featuredArticlesSubtitle),
        whyChooseTitle: sanitizeArabicText(settings.sections.whyChooseTitle),
        whyChooseDescription: sanitizeArabicText(settings.sections.whyChooseDescription),
        testimonialsTitle: sanitizeArabicText(settings.sections.testimonialsTitle),
        testimonialsSubtitle: sanitizeArabicText(settings.sections.testimonialsSubtitle),
    },
    testimonials: settings.testimonials.map((testimonial) => ({
        ...testimonial,
        name: sanitizeArabicText(testimonial.name),
        degree: sanitizeArabicText(testimonial.degree),
        text: sanitizeArabicText(testimonial.text),
    })),
});
