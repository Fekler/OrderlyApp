import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserDto } from '../../../interfaces/user.interface'; // Assuming you have a User DTO
import { UserRole } from '../../../interfaces/enums.interface'; // Assuming you have a User DTO
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button'; 


@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  displayedColumns: string[] = ['uuid', 'fullName', 'email', 'userRole', 'isActive', 'actions'];



  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
        } else {
          this.errorMessage = response.message || 'Erro ao carregar usuários.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar usuários.';
        console.error('Erro ao carregar usuários:', error);
        this.isLoading = false;
      },
    });
  }

  editUser(uuid: string): void {
    this.router.navigate(['/admin/users/edit', uuid]);
  }

  getUserRole(userRole: number | undefined): string {
    switch (userRole) {
      case UserRole.Admin:
        return 'Administrador';
      case UserRole.Seller:
        return 'Vendedor';
      case UserRole.Client:
        return 'Cliente';
      default:
        return 'Desconhecido';
    }
  }

  deleteUser(uuid: string): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.userService.deleteUser(uuid).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadUsers(); // Reload the user list after deletion
            // Optionally, show a success message
          } else {
            this.errorMessage = response.message || 'Erro ao excluir usuário.';
          }
        },
        error: (error) => {
          this.errorMessage = 'Erro ao excluir usuário.';
          console.error('Erro ao excluir usuário:', error);
        },
      });
    }
  }
}
