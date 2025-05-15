import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { UserRole } from '../../../interfaces/enums.interface'
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-user',
  standalone: false,
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  createUserForm: FormGroup;
  errorMessage: string = '';
  //userRoles = Object.values(UserRole).filter(value => typeof value === 'string');
  userRoles: { name: string; value: UserRole }[] = Object.keys(UserRole)
    .filter((key) => isNaN(Number(key))) // Filtra as chaves que não são números (índices reversos)
    .map((key) => ({
      name: key,
      value: UserRole[key as keyof typeof UserRole]
    }));
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.createUserForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', Validators.required],
      document: [''],
      userRole: ['', Validators.required],
    });
  }

  createUser(): void {
    if (this.createUserForm.valid) {
      this.userService.createUser(this.createUserForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/admin/users']); // Redirect to user list
            // Optionally, show a success message
          } else {
            this.errorMessage = response.message || 'Erro ao criar usuário.';
          }
        },
        error: (error) => {
          this.errorMessage = 'Erro ao criar usuário.';
          console.error('Erro ao criar usuário:', error);
        },
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios corretamente.';
    }
  }
  userRoleMethodMap: { [key: string]: number } = {
    'Administrador': UserRole.Admin,
    'Cliente': UserRole.Client,
    'Vendedor': UserRole.Seller
  };

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}
