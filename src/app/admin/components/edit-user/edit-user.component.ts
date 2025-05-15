import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from '../../../interfaces/user.interface';
import { UserRole } from '../../../interfaces/enums.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  errorMessage: string = '';
  userUuid: string | null = null;
  userRoles: { name: string; value: UserRole }[] = Object.keys(UserRole)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      name: key,
      value: UserRole[key as keyof typeof UserRole]
    }));
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editUserForm = this.fb.group({
      uuid: [{ value: '', disabled: true }, Validators.required],
      fullName: [''],
      email: ['', [Validators.email]],
      phone: [''],
      document: [''],
      userRole: [''],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userUuid = params['uuid'];
      if (this.userUuid) {
        this.loadUser(this.userUuid);
      }
    });
  }

  loadUser(uuid: string): void {
    this.userService.getUserByUuid(uuid).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.editUserForm.patchValue(response.data);
        } else {
          this.errorMessage = response.message || 'Erro ao carregar dados do usuário.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar dados do usuário.';
        console.error('Erro ao carregar dados do usuário:', error);
      },
    });
  }

  updateUser(): void {
    if (this.editUserForm.valid && this.userUuid) {
      const updatedUserData = { ...this.editUserForm.getRawValue(), uuid: this.userUuid };
      this.userService.updateUser(updatedUserData).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/admin/users']); // Redirect to user list
            // Optionally, show a success message
          } else {
            this.errorMessage = response.message || 'Erro ao atualizar usuário.';
          }
        },
        error: (error) => {
          this.errorMessage = 'Erro ao atualizar usuário.';
          console.error('Erro ao atualizar usuário:', error);
        },
      });
    } else {
      this.errorMessage = 'Por favor, preencha os campos corretamente.';
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}
