/* eslint-disable */
const stripe = Stripe(
  'pk_test_51Mb3uXCt6AIji4auVb8aTlFxAJlDJ4qzujgglI7yfpkLdJbZraa5RXwWcTqegSPJhxExkYfTFsUb2VRstkOa5vvB00ynNevXhj'
);

const bookTour = async tourId => {
  try {
    const res = await fetch(`/api/v1/bookings/checkout-session/${tourId}`);
    if (!res.ok) {
      err = await res.json();
      throw new Error(err.message);
    }
    const data = await res.json();
    await stripe.redirectToCheckout({
      sessionId: data.session.id
    });
  } catch (err) {
    showAlert('error', err);
  }
};

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message);
    }
    showAlert('success', 'Logged in successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 1000);

    const data = await res.json();
  } catch (err) {
    showAlert('error', err);
  }
};
const signup = async payload => {
  try {
    const res = await fetch('/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message);
    }
    showAlert('success', 'Logged in successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 1000);

    const data = await res.json();
  } catch (err) {
    showAlert('error', err);
  }
};

const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout');
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message);
    }
    location.assign('/');
    const data = await res.json();
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

const updateSettings = async (payload, type) => {
  const url =
    type === 'password'
      ? '/api/v1/users/updatePassword'
      : '/api/v1/users/updateMe';
  const method = type === 'password' ? 'POST' : 'PATCH';
  try {
    const res = await fetch(url, {
      method: method,
      body: payload
    });
    if (!res.ok) {
      const data = await res.json();

      throw new Error(data.message);
    }
    const data = await res.json();
    if (data.status === 'Success') {
      showAlert('success', `${type} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};

const loginForm = document.querySelector('.form-login');
const signupForm = document.querySelector('.form-signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn-signup').textContent = 'Updating...';

    const email = document.getElementById('email-signup').value;
    const name = document.getElementById('name-signup').value;
    const password = document.getElementById('password-signup').value;
    const passwordConfirm = document.getElementById('confirm-password-signup')
      .value;
    await signup({
      email,
      name,
      password,
      passwordConfirm
    });
    document.querySelector('.btn-signup').textContent = 'Sign up';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}

if (updateDataForm) {
  updateDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}
if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      {
        passwordCurrent,
        password,
        passwordConfirm
      },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

/* eslint-disable */
const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaWJyYWhpbWFza2FyLTExIiwiYSI6ImNsZG8ycm9nMzA1eTgzcXJzb3QxdzZvYnYifQ.ckorA7c_SujyqnkGZAwpFg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ibrahimaskar-11/cldo34dua000d01pgvvf80ac5',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};

const mapBox = document.getElementById('map');
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
