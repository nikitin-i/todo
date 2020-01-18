import 'bootstrap';

import styles from './scss/main.scss';

import Controller from './js/controller/controller.js';
import Model from './js/model/model.js';
import View from './js/view/view.js';

const controller = new Controller(Model, View);
controller.init();