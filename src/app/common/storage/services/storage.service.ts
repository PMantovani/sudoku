import { Inject, Injectable, InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage) {}

  public get<T>(key: string): T | undefined {
    const value = this.localStorage.getItem(key);

    return value ? JSON.parse(value) as T : undefined;
  }

  // tslint:disable-next-line: no-any
  public set<T = any>(key: string, item: T): void {
    this.localStorage.setItem(key, JSON.stringify(item));
  }
}
