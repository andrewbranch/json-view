/**
 * Created by r1ch4 on 02/10/2016.
 */

import "../devtools.css";
import JSONView from "../JSONView.js";

var view = new JSONView('example', {
    hello : 'world',
    doubleClick : 'me to edit',
    a : null,
    b : true,
    c : false,
    d : 1,
    e : {nested : 'object'},
    f : [1,2,3]
});

view.expand(true);

document.body.appendChild(view.dom);
window.view = view;