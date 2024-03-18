import View from "./View";
import previewView from "./previewView";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = " No recipes found for your queries! Please try again.";
  _defaultMessage =
    "Start by searching for a recipe or an ingredient. Have fun!";
  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
