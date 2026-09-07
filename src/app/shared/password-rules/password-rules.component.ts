import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { commonPasswords } from './common-passwords';

@Component({
  selector: 'app-password-rules',
  standalone: true,
  templateUrl: './password-rules.component.html',
  styleUrls: ['./password-rules.component.scss'],
  imports: [ReactiveFormsModule]
})
export class PasswordRulesComponent implements OnInit {

  @Input() passwordControl!: FormControl;

  rules = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  };

  // Opzionale: lista di password comuni
  private readonly commonPasswords = commonPasswords;

  ngOnInit(): void {
    if (!this.passwordControl) return;

    // Ascolta gli input del FormControl
    this.passwordControl.valueChanges.subscribe(val => this.validatePassword(val));
  }

  private validatePassword(val: string): void {
    if (!val) {
      Object.keys(this.rules).forEach(key => (this.rules[key as keyof typeof this.rules] = false));
      return;
    }

    this.rules.length = val.length >= 8;
    this.rules.uppercase = /[A-Z]/.test(val);
    this.rules.lowercase = /[a-z]/.test(val);
    this.rules.number = /\d/.test(val);
    this.rules.special = /[!@#$%^&*()]/.test(val);

    // Messaggio per password troppo comune
    if (this.commonPasswords.has(val.toLowerCase())) {
      this.rules.length = true; // evidenzia comunque in verde per distinguere
    }
  }

  // Funzione di supporto per template
  isValid(rule: keyof typeof this.rules): boolean {
    return this.rules[rule];
  }


}
