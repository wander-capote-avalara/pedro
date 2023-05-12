
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export abstract class Service {

    public BASE_URL = '';

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    emitLoading: EventEmitter<any> = new EventEmitter();

    constructor(
        public http: HttpClient,
        protected tableName: string,
    ) {
        this.setBaseUrl();
    }

    setBaseUrl() {
        this.BASE_URL = '/api/';
    }

    getDefaultBaseURL() {
        return `${this.BASE_URL}${this.tableName}`;
    }

    public delete(id: any) {
        return this.http.delete(`${this.BASE_URL}${this.tableName}/${id}`);
    }

    public put(id: any, obj: any) {
        return this.http.put(`${this.BASE_URL}${this.tableName}/${id}`, obj);
    }

    changeTable(table: string) {
        this.tableName = table;
    }

    public get(id: any) {
        return this.http.get(`${this.BASE_URL}${this.tableName}${id ? '/' + id : ''}`);
    }

    public post(data: any) {
        return this.http.post(`${this.BASE_URL}${this.tableName}`, data);
    }
}

@Injectable()
export class UserService extends Service {
    constructor(http: HttpClient) {
        super(http, 'user');
    }
}

@Injectable()
export class LoginService extends Service {
    constructor(http: HttpClient) {
        super(http, 'login');
    }
}
