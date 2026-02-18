// contact.js: initialize modal using shared modal.js
window.initModal &&
  window.initModal({
    modalId: "contact-modal",
    triggerAttr: "data-contact-trigger",
    overlayAttr: "data-contact-overlay",
    closeAttr: "data-contact-close",
  });

// Copy-email handler: copies email from [data-copy-email] and announces to #aria-live-contact
(function(){
  if (window.__contact_copy_email_attached) return;
  window.__contact_copy_email_attached = true;

  function announce(msg){
    var el = document.getElementById('aria-live-contact');
    if (!el) return;
    el.textContent = msg;
  }

  document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('[data-copy-email]');
    if (!btn) return;
    var email = btn.getAttribute('data-copy-email');
    if (!email) return;
    var label = (btn.getAttribute('aria-label') || btn.textContent || '').trim();

    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(email).then(function(){
        announce(label ? (label + ' ' + email) : email);
      }, function(){ announce(label || ''); });
    } else {
      try{
        var ta = document.createElement('textarea');
        ta.value = email;
        ta.setAttribute('readonly','');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        announce(label ? (label + ' ' + email) : email);
      }catch(err){ announce(label || ''); }
    }
  });
})();

(function(){
  if (window.__contact_form_handler_attached) return;
  window.__contact_form_handler_attached = true;

  var form = document.getElementById('contact-form');
  var status = document.getElementById('contact-form-status');
  var submitBtn = form && form.querySelector('button[type="submit"]');
  if (!form || !status || !submitBtn) return;

  var nameInput = form.querySelector('input[name="name"]');
  var emailInput = form.querySelector('input[name="email"]');
  var subjectInput = form.querySelector('input[name="subject"]');
  var messageInput = form.querySelector('textarea[name="message"]');
  var consentInput = form.querySelector('input[name="consent_marketing"]');
  var honeypotInput = form.querySelector('input[name="hp"]');

  var isSubmitting = false;
  var originalButtonContent = submitBtn.innerHTML;

  function resolveKey(source, dottedKey){
    if (!source || !dottedKey) return undefined;
    if (Object.prototype.hasOwnProperty.call(source, dottedKey)) return source[dottedKey];
    var parts = dottedKey.split('.');
    var cur = source;
    for (var i = 0; i < parts.length; i++){
      if (!cur || typeof cur !== 'object' || !(parts[i] in cur)) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function getDictionary(){
    var cache = window.i18n && window.i18n.cache;
    var lang = window.i18n && window.i18n.current
      ? window.i18n.current
      : document.documentElement.lang || 'en';
    return cache && cache[lang] ? cache[lang] : {};
  }

  function translate(key, fallback){
    var dict = getDictionary();
    var value = resolveKey(dict, key);
    return typeof value === 'string' && value ? value : fallback || '';
  }

  function updateStatus(message){
    if (!message){
      status.textContent = '';
      status.setAttribute('hidden', '');
      return;
    }
    status.textContent = message;
    status.removeAttribute('hidden');
  }

  function showError(message){
    updateStatus(message);
  }

  function showSuccess(message){
    updateStatus(message);
  }

  function disableButton(){
    originalButtonContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.innerHTML = translate('contact.form.sending', 'Sending…');
  }

  function resetButton(){
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-busy');
    submitBtn.innerHTML = originalButtonContent;
  }

  function validate(){
    var requiredMessage = translate(
      'contact.form.error',
      'Please complete the required fields.'
    );

    if (nameInput && !nameInput.value.trim()){
      showError(requiredMessage);
      nameInput.focus();
      return false;
    }

    var emailValue = emailInput ? emailInput.value.trim() : '';
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue || !emailPattern.test(emailValue)){
      showError(requiredMessage);
      emailInput && emailInput.focus();
      return false;
    }

    var messageValue = messageInput ? messageInput.value.trim() : '';
    if (!messageValue){
      showError(requiredMessage);
      messageInput && messageInput.focus();
      return false;
    }

    if (consentInput && !consentInput.checked){
      showError(
        translate(
          'contact.form.consent_required',
          'Please agree to the checkbox before sending.'
        )
      );
      consentInput.focus();
      return false;
    }

    if (honeypotInput && honeypotInput.value.trim()){
      showError(translate('contact.form.error', 'Message could not be sent.'));
      return false;
    }

    return true;
  }

  form.addEventListener('submit', function(event){
    if (!window.fetch) return;
    if (isSubmitting){
      event.preventDefault();
      return;
    }

    event.preventDefault();

    if (!validate()) return;

    var payload = {
      name: nameInput ? nameInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      subject: subjectInput ? subjectInput.value.trim() : '',
      message: messageInput ? messageInput.value.trim() : '',
      consent_marketing: consentInput ? !!consentInput.checked : false,
    };

    isSubmitting = true;
    disableButton();
    updateStatus('');

    fetch('/contact', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function(response){
        return response
          .json()
          .catch(function(){
            return null;
          })
          .then(function(data){
            if (!response.ok){
              var message =
                (data && (data.error || data.message)) ||
                translate('contact.form.error', 'Something went wrong.');
              var err = new Error(message);
              err.fallback = message;
              throw err;
            }
            return data;
          });
      })
      .then(function(data){
        var successMessage =
          (data && data.message) ||
          translate('contact.form.success', 'Message sent!');
        showSuccess(successMessage);
        form.reset();
      })
      .catch(function(err){
        var fallbackMessage =
          (err && err.message) ||
          translate(
            'contact.form.error',
            'Something went wrong. Please try again.'
          );
        showError(fallbackMessage);
        console.error(err);
      })
      .finally(function(){
        isSubmitting = false;
        resetButton();
        if (honeypotInput){
          honeypotInput.value = '';
        }
      });
  });
})();
