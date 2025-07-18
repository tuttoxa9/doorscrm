# Включение анонимной аутентификации в Firebase

## Зачем это нужно
Анонимная аутентификация позволяет пользователям загружать файлы без регистрации, но с соблюдением правил безопасности Firebase.

## Как включить

### 1. Откройте Firebase Console
- Перейдите в [Firebase Console](https://console.firebase.google.com/)
- Выберите проект `mebel-be602`

### 2. Перейдите в Authentication
- В левом меню выберите **Authentication**
- Перейдите на вкладку **Sign-in method**

### 3. Включите Anonymous authentication
- Найдите в списке провайдеров **Anonymous**
- Нажмите на него для настройки
- Переключите тумблер в положение **Enable**
- Нажмите **Save**

### 4. Проверьте настройки
После включения анонимной аутентификации:
- Загрузка изображений должна работать
- Пользователи будут автоматически аутентифицироваться как анонимные
- Это безопаснее чем полностью открытые правила

## Альтернативный вариант: Правила без аутентификации

Если не хотите включать аутентификацию, используйте эти правила Storage:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**Внимание:** Эти правила разрешают доступ всем. Используйте только для тестирования!
