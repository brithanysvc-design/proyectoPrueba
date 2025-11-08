import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
    const date = new Date(value);

    switch (format) {
      case 'short':
        return date.toLocaleDateString('es-CR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      case 'long':
        return date.toLocaleDateString('es-CR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'time':
        return date.toLocaleTimeString('es-CR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return date.toLocaleDateString('es-CR');
    }
  }
}