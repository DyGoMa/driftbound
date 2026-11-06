// Homepage. Bare for now: shows the Salvage total and the Monster book size. Runs only after the 18+ gate.
DriftGate.whenPassed(function () {
  document.getElementById('total').textContent = 'Salvage: ' + DriftSave.load().salvage;
  document.getElementById('book').textContent = 'Coming soon (' + DRIFT_CONFIG.monsterBookSlots + ' pals to find)';
});
