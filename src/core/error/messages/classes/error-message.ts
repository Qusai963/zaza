export class ErrorMessage {
  private translations: Record<string, string>;

  constructor(translations: Record<string, string>) {
    this.translations = translations;
  }

  getMessage(language: string): string {
    const translation = this.translations[language];
    return translation || this.translations['en'];
  }
}
