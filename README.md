# memoria-viva
Trabalho de Conclusão de Curso
Claro! Aqui está um **resumo do método utilizado para rodar o app Ionic com Firebase Authentication e Facebook Login no Android**:

---

### ✅ **Resumo do Método Utilizado**

#### 1. **Configuração do Projeto**

* Você iniciou com um projeto **Ionic com Capacitor**.
* O projeto usa os plugins:

  * `@capacitor-firebase/authentication`
  * `@capacitor-community/facebook-login`
* O plugin do Firebase tinha dependência de `firebase@^11.2.0`, mas seu projeto usava `firebase@12.x`.

---

#### 2. **Resolução de Conflitos de Dependência**

* Ao adicionar a plataforma Android via:

  ```bash
  ionic cordova platform add android
  ```

  Ocorreu erro de conflito entre versões do `firebase`.

* Foi usada a seguinte solução:

  ```bash
  npm install --legacy-peer-deps
  ```

  Isso força o `npm` a ignorar conflitos de dependência **peer**, permitindo instalar mesmo com versões incompatíveis.

---

#### 3. **Correção do SDK Android**

* Ao tentar rodar o app, apareceu erro:

  ```
  SDK location not found
  ```
* Solução:

  * Foi definido o caminho do SDK Android via o arquivo:

    ```
    android/local.properties
    ```

    Com o conteúdo:

    ```properties
    sdk.dir=C:\\Users\\Aluno\\AppData\\Local\\Android\\Sdk
    ```
  * Ou, alternativamente, poderia ser configurado via variável de ambiente `ANDROID_HOME`.

---

#### 4. **Compilação e Build**

* Após resolver os conflitos e configurar o SDK:

  * A compilação foi feita com sucesso usando:

    ```bash
    ionic cordova run android
    ```
  * O processo envolveu:

    * Build de todos os plugins (capacitor-firebase-auth, facebook-login etc.)
    * Geração de recursos
    * Compilação Java
    * Geração dos `.apk` para emulador ou dispositivo.

---

### ⚠️ **Observações Importantes**

* Algumas bibliotecas usaram **APIs obsoletas**, mas isso **não impediu o build**.
* Foi exibido aviso sobre o **Java 21** ser recente para `source/target 8`. O Android recomenda usar Java 17 ou configurar `javaCompileOptions`.

---

### ✅ Resultado Final

O app foi compilado com sucesso e estava pronto para rodar em dispositivo Android ou emulador.

---

Se quiser, posso te ajudar a **automatizar** esse processo com um script, ou a gerar um **README** técnico explicando esse setup. Deseja isso?
