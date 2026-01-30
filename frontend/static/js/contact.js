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
