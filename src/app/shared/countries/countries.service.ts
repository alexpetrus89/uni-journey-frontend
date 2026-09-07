import { Injectable } from '@angular/core';
import { isoCountries } from './iso-countries';

export interface Country {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private countries: Country[] = [];
  private browserRegion: string | null = null;

  constructor() {
    this.loadCountries();
  }

  /** Ritorna la lista dei paesi */
  getCountries(): Country[] {
    return this.countries;
  }

  /** Ritorna il codice del paese del browser, se presente */
  getBrowserRegion(): string | null {
    return this.browserRegion;
  }

  /** Carica e popola i paesi con localizzazione */
  private loadCountries(): void {
    const userLocale = navigator.language || 'en-US';
    const [browserLang, browserRegion] = userLocale.split('-');
    const supportedLangs = ['en', 'it', 'fr', 'de', 'es', 'pt', 'nl', 'sv', 'pl', 'ru', 'ja', 'zh', 'ar'];
    const lang = supportedLangs.includes(browserLang) ? browserLang : 'en';
    this.browserRegion = browserRegion ? browserRegion.toUpperCase() : null;

    // Cache sessionStorage
    const storageKey = `countries_${lang}`;
    const cached = sessionStorage.getItem(storageKey);
    if (cached) {
      this.countries = JSON.parse(cached);
      return;
    }

    let regionNames: Intl.DisplayNames;
    try {
      regionNames = new Intl.DisplayNames([lang], { type: 'region' });
    } catch {
      regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    }

    this.countries = isoCountries
      .map(code => ({ code, name: regionNames.of(code) || '' }))
      .filter(c => c.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    sessionStorage.setItem(storageKey, JSON.stringify(this.countries));
  }

}

