const express = require('express');
const router = express.Router();
const path = require('path');

// Auth pages (no layout check needed - client side handles redirect)
router.get('/', (req, res) => res.redirect('/login'));
router.get('/login', (req, res) => res.render('pages/auth/login', { title: 'Connexion — Recouvra+' }));
router.get('/signup', (req, res) => res.render('pages/auth/signup', { title: 'Inscription — Recouvra+' }));
router.get('/forgot-password', (req, res) => res.render('pages/auth/forgot-password', { title: 'Mot de passe oublié — Recouvra+' }));
router.get('/reset-password', (req, res) => res.render('pages/auth/reset-password', { title: 'Réinitialisation — Recouvra+', token: req.query.token || '' }));

// App pages
router.get('/dashboard', (req, res) => res.render('pages/dashboard/index', { title: 'Tableau de bord', page: 'dashboard' }));
router.get('/clients',   (req, res) => res.render('pages/clients/index',   { title: 'Clients', page: 'clients' }));
router.get('/invoices',  (req, res) => res.render('pages/invoices/index',  { title: 'Factures', page: 'invoices' }));
router.get('/recovery',  (req, res) => res.render('pages/recovery/index',  { title: 'Recouvrement', page: 'recovery' }));
router.get('/logout',    (req, res) => res.redirect('/login'));

module.exports = router;