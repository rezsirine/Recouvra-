const express = require('express');
const router = express.Router();
const path = require('path');

// Auth pages (no layout check needed - client side handles redirect)
router.get('/', (req, res) => res.redirect('/login'));
router.get('/login', (req, res) => res.render('auth/login', { layout: false, title: 'Connexion — Recouvra+' }));
router.get('/signup', (req, res) => res.render('auth/signup', { layout: false, title: 'Inscription — Recouvra+' }));
router.get('/forgot-password', (req, res) => res.render('auth/forgot-password', { layout: false, title: 'Mot de passe oublié — Recouvra+' }));
router.get('/reset-password', (req, res) => res.render('auth/reset-password', { layout: false, title: 'Réinitialisation — Recouvra+', token: req.query.token || '' }));

// App pages
router.get('/dashboard', (req, res) => res.render('dashboard', { title: 'Tableau de bord', page: 'dashboard', user: { name: "Utilisateur", role: "agent" } }));
router.get('/clients',   (req, res) => res.render('clients',   { title: 'Clients', page: 'clients', user: { name: "Utilisateur", role: "agent" } }));
router.get('/invoices',  (req, res) => res.render('invoices',  { title: 'Factures', page: 'invoices', user: { name: "Utilisateur", role: "agent" } }));
router.get('/recovery',  (req, res) => res.render('recovery',  { title: 'Recouvrement', page: 'recovery', user: { name: "Utilisateur", role: "agent" } }));
router.get('/logout',    (req, res) => res.redirect('/login'));

module.exports = router;