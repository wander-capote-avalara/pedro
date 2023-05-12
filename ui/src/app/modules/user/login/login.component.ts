import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/core.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private service: LoginService) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    
    
  }

  async onSubmit() {
    if(this.loginForm.invalid) {
      console.log('error')
      return;
    }
    try {
      const { token } = await this.service.post(this.loginForm.value).toPromise() as any;
      alert('logado com sucesso')
      console.log('token', token)
    } catch (err:any) {
      alert(`ERRO: ${err?.message}`)
    }
  }
}
