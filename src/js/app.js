import './modules/jquery-init'
import './modules/_main-slider';
import './modules/_Sketch';
import {splitLetters} from "./modules/split-letters";

$('[data-split-words]').each(function() {
    splitLetters(this, "<span class=\"word word-#\" style=\"--index:#\">$</span>", "", "");
});
