import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthloginService {

  private userRole = new BehaviorSubject<string | null>(null);
  user$: Observable<firebase.User | null>;

  private currentUserSubject = new BehaviorSubject<any>(null); // Aquí almacenamos el usuario
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable(); // Observable para que otros componentes se suscriban

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user$ = this.afAuth.authState;
    this.afAuth.authState.subscribe((user) => {
      console.log('Estado del usuario:', user);
    });

    this.afAuth.authState
    .pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection('Usuarios')
            .doc(user.uid)
            .valueChanges()
            .pipe(
              map((userData) => {
                if (!userData) {
                  console.warn('No se encontraron datos del usuario en Firestore.');
                }
                return {
                  uid: user.uid,
                  email: user.email || '',
                  ...(userData || {}),
                };
              })
            );
        } else {
          return of(null);
        }
      })
    )
    .subscribe((userData) => {
      if (userData) {
        console.log('Datos del usuario:', userData);
        this.currentUserSubject.next(userData);
      } else {
        console.warn('No hay usuario autenticado.');
      }
    });
  }


  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  getUser(): Observable<any> {
    return this.afAuth.authState;
}

// Modificación del método para obtener el usuario y su información en Firestore
getUser2(): Observable<any> {
  return this.afAuth.authState.pipe(
    switchMap((user) => {
      if (user) {
        console.log('Usuario autenticado:', user); // UID y email
        return this.firestore
          .collection('Usuarios')
          .doc(user.uid)
          .valueChanges()
          .pipe(
            map((userData) => {
              if (userData) {
                console.log('Datos del usuario en Firestore:', userData);
              } else {
                console.warn(`No se encontraron datos en Firestore para el UID: ${user.uid}`);
              }
              return {
                uid: user.uid,
                email: user.email || '',
                ...userData!, // Combina datos de Auth y Firestore
              };
            })
          );
      } else {
        console.warn('No hay usuario autenticado.');
        return of(null);
      }
    })
  );
}


/*----------------------------------------------------
Esto estaba dentro de setRole
if (this.isLocalStorageAvailable()) {
      localStorage.setItem('userRole', role);
    } else {
      console.warn('localStorage no está disponible.');
    }

Y esto dentro de getRole
        if (this.isLocalStorageAvailable()) {
      const savedRole = localStorage.getItem('userRole');
      if (savedRole) {
        this.userRole.next(savedRole);
      }
    } else {
      console.warn('localStorage no está disponible.');
    }

      // Verificar si localStorage está disponible
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  -----------------------------------------------------
*/
  // Método para establecer el rol del usuario
  setRole(role: string): void {
    this.userRole.next(role);
  }

  // Método para obtener el rol del usuario
  getRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }


}
