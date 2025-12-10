import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to CineStream",
      "search_placeholder": "Search for movies...",
      "login": "Login",
      "signup": "Sign Up",
      "logout": "Logout",
      "favorites": "Favorites",
      "profile": "Profile",
      "popular": "Popular Movies",
      "rating": "Rating",
      "release_date": "Release Date",
      "upload_photo": "Upload Profile Photo",
      "offline_mode": "You are currently offline.",
      "merge_success": "Your local favorites were merged with your account.",
      "email": "Email",
      "password": "Password",
      "confirm_password": "Confirm Password",
      "sort_popularity": "Most Popular",
      "sort_rating": "Top Rated",
      "sort_release": "Newest Releases",
      "prev": "Previous",
      "next": "Next",
      "page_of": "Page {{current}} of {{total}}",
      "runtime": "Runtime",
      "revenue": "Revenue",
      "budget": "Budget",
      "status": "Status",
      "add_fav": "Add to Favorites",
      "remove_fav": "Remove from Favorites",
      "remove": "Remove",
      "no_fav_title": "No favorites yet",
      "no_fav_desc": "Start exploring movies and add them to your collection.",
      "browse": "Browse Movies",
      "stats_reviews": "Reviews",
      "stats_lists": "Lists",
      "account_stats": "Account Stats",
      "min": "min"
    }
  },
  ru: {
    translation: {
      "welcome": "Добро пожаловать в CineStream",
      "search_placeholder": "Поиск фильмов...",
      "login": "Войти",
      "signup": "Регистрация",
      "logout": "Выйти",
      "favorites": "Избранное",
      "profile": "Профиль",
      "popular": "Популярные фильмы",
      "rating": "Рейтинг",
      "release_date": "Дата выхода",
      "upload_photo": "Загрузить фото профиля",
      "offline_mode": "Вы находитесь в автономном режиме.",
      "merge_success": "Ваши локальные закладки были объединены с аккаунтом.",
      "email": "Электронная почта",
      "password": "Пароль",
      "confirm_password": "Подтвердите пароль",
      "sort_popularity": "Самые популярные",
      "sort_rating": "Высокий рейтинг",
      "sort_release": "Новинки",
      "prev": "Назад",
      "next": "Вперед",
      "page_of": "Страница {{current}} из {{total}}",
      "runtime": "Длительность",
      "revenue": "Сборы",
      "budget": "Бюджет",
      "status": "Статус",
      "add_fav": "В избранное",
      "remove_fav": "Убрать из избранного",
      "remove": "Удалить",
      "no_fav_title": "Нет избранных",
      "no_fav_desc": "Начните искать фильмы и добавляйте их в коллекцию.",
      "browse": "Искать фильмы",
      "stats_reviews": "Отзывы",
      "stats_lists": "Списки",
      "account_stats": "Статистика аккаунта",
      "min": "мин"
    }
  },
  kz: {
    translation: {
      "welcome": "CineStream платформасына қош келдіңіз",
      "search_placeholder": "Фильмдерді іздеу...",
      "login": "Кіру",
      "signup": "Тіркелу",
      "logout": "Шығу",
      "favorites": "Таңдаулылар",
      "profile": "Профиль",
      "popular": "Танымал фильмдер",
      "rating": "Рейтинг",
      "release_date": "Шыққан күні",
      "upload_photo": "Профиль суретін жүктеу",
      "offline_mode": "Интернет байланысы жоқ.",
      "merge_success": "Деректер аккаунтпен сәтті біріктірілді.",
      "email": "Электрондық пошта",
      "password": "Құпия сөз",
      "confirm_password": "Құпия сөзді растаңыз",
      "sort_popularity": "Ең танымал",
      "sort_rating": "Жоғары рейтинг",
      "sort_release": "Жаңа шыққандар",
      "prev": "Алдыңғы",
      "next": "Келесі",
      "page_of": "{{current}} / {{total}} бет",
      "runtime": "Ұзақтығы",
      "revenue": "Табыс",
      "budget": "Бюджет",
      "status": "Күйі",
      "add_fav": "Таңдаулыларға қосу",
      "remove_fav": "Таңдаулылардан алып тастау",
      "remove": "Жою",
      "no_fav_title": "Таңдаулылар тізімі бос",
      "no_fav_desc": "Фильмдерді іздеп, жинаққа қосуды бастаңыз.",
      "browse": "Фильмдерді шолу",
      "stats_reviews": "Пікірлер",
      "stats_lists": "Тізімдер",
      "account_stats": "Аккаунт статистикасы",
      "min": "мин"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;