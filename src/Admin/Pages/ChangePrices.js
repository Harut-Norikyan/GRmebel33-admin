import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import uuid from 'react-uuid';
import Api from '../../Api';
import AlertService from '../../Services/AlertService';
import { addPageSpinner, removePageSpinner } from '../../store/actions/spinner';

const ChangePrices = () => {
  const dispatch = useDispatch();

  const [actionId, setActionId] = useState(1);
  const [percent, setPercent] = useState("");
  const [isInvalidSubmit, setIsInvalidSubmit] = useState(false)

  const priceActions = [
    { value: 1, label: 'Увелечить цены' },
    { value: 2, label: 'Уменьшить цены' },
  ]

  const onSelectOptionChange = (event) => {
    setActionId(event.value)
  }

  const onNumberChange = (event) => {
    if (+event.target.value.charAt(0) === 0) {
      event.target.value = event.target.value.substring(1);
    }
    setPercent(+event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const spinnerId = uuid();
    if (!actionId || !percent) {
      setIsInvalidSubmit(true)
    } else {
      AlertService.alertConfirm(
        `Вы действительно хотите ${actionId === 1 ? "увелечить" : "уменьшить"} цены на товары на ${percent}% ?`, "Да", "Нет"
      ).then(() => {
        const data = {
          actionId,
          percent
        }
        dispatch(addPageSpinner(spinnerId));
        Api.changePrices(data).then(response => {
          dispatch(removePageSpinner(spinnerId));
          if (response) {
            AlertService.alert("success", response.data.message);
          }
        }).catch(error => getFail(error, spinnerId))
      })
    }
  }

  const getFail = (message, spinnerId) => {
    message && AlertService.alert(message);
    spinnerId && this.props.removePageSpinner(spinnerId);
  }

  return (
    <div className="container">
      <div>
        <h2 className="title">Изменить цены</h2>
        <div className="row">
          <form onSubmit={onSubmit}>
            <div className="change-price-wrapper">
              <div>

                <div className="change-price-wrapper-item">
                  <label htmlFor="" className="mb-1">Выберите действие</label>
                  <Select
                    options={priceActions}
                    value={(() => {
                      var selectedValues = priceActions.find(action => action.value === actionId);
                      if (selectedValues) {
                        selectedValues.label = selectedValues.label;
                        selectedValues.value = selectedValues.value;
                      }
                      return selectedValues;
                    })()}
                    onChange={onSelectOptionChange}
                  />

                </div>
                <div className="change-price-wrapper-item mt-4">
                  <label htmlFor="percent" className="mb-1">
                    {`На сколько процентов вы бы хотели ${actionId === 1 ? "увелечить" : "уменьшить"} цены на товары`}
                  </label>
                  <input
                    id="percent"
                    type="number"
                    placeholder="процент"
                    name="percent"
                    min="1"
                    value={percent}
                    onChange={onNumberChange}
                    className={`p-2 ${isInvalidSubmit && !percent ? "error" : ""}`}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="btn btn-outline-primary admin-button mr-2 mt-4"
                >
                  {`${actionId === 1 ? "Увелечить цены" : "Уменьшить цены"}`}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary admin-button ml-2 mt-4"
                >
                  Отмена
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default ChangePrices;
