$(function() {
  // Hide alert box on page load
  const $alertPanel = $('#form-alert');
  $alertPanel.hide();

  //Ajax POST request on form submit on main page.
  let $pollForm = $('#create-poll');
  let $choices = $('#poll-choices');

  // Submit form event
  $pollForm.submit(function(event) {
    console.log('Submit button clicked!');
    event.preventDefault();
    let formData = jQuery($pollForm).serializeArray();
    let parsedFormData = {};

    if ($alertPanel.is(':visible')) {
      $alertPanel.slideUp('slow', function() {
        formValidation(formData);
      });
    } else {
      formValidation(formData);
    }

    function formValidation(data) {
      if (!data[0].value) {
        $alertPanel.slideToggle();
        $('#form-alert .panel-body').text(
          'Please write a prompt for your poll'
        );
      } else if (!data[1].value) {
        $alertPanel.slideToggle();
        $('#form-alert .panel-body').text(
          'Please insert a valid email address'
        );
      } else {
        parsedFormData[data[0].name] = data[0].value;
        parsedFormData[data[1].name] = data[1].value;
        for (let counter = 2; counter < data.length; counter += 2) {
          if (data[counter].value) {
            parsedFormData[data[counter].name] = data[counter].value;
            parsedFormData[data[counter + 1].name] = data[counter + 1].value;
          }
        }
        if (Object.keys(parsedFormData).length <= 4) {
          $('#form-alert .panel-body').text(
            'Please create a poll with at least two options'
          );
          $alertPanel.slideToggle();
        } else {
          console.log('parsed data', parsedFormData);
          $.post('/', parsedFormData, function(data, status) {
            if (status === 'success') {
              const resultPath = '/result/';
              location.href = resultPath + data;
              console.log(location.href);
            }
          });
        }
      }
    }
  });

  /*
   * The next event listener watch for interaction with the last choice input
   * group, to add a new one as needed. A new group
   * should be appended if the user begins to fill data into the last group
   * (there should always be at least one empty group at the bottom of the form)
   */
  const $pollChoices = $('#poll-choices');

  $pollChoices.on('keyup', event => {
    console.log('Poll choices on keyup');
    // On change of last input group, make a new input group
    const $lastChoiceGroup = $pollChoices.children().last();

    // Check if title field is being filled in
    if (getTitleValue($lastChoiceGroup)) {
      // Append a new input group
      $pollChoices.append(createChoiceGroup($pollChoices.children().length));
    }
  });
});

function getTitleValue(choiceGroup) {
  return choiceGroup
    .children('.choice-title')
    .first()
    .val();
}

function createChoiceGroup(number) {
  return `
    <div class="input-group">
      <span class="input-group-addon">
        <span class="glyphicon glyphicon-menu-right"></span>
      </span>
      <input
        type="text"
        class="form-control choice-title"
        name="title${number}"
        placeholder="Option"
      />
      <input
        type="text"
        class="form-control choice-description"
        name="desc${number}"
        placeholder="Description (optional)"
      />
    </div>
  `;
}
