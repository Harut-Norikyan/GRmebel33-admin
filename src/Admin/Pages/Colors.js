import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MdUpdate } from "react-icons/md";
import { BiReset } from "react-icons/bi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { addPageSpinner, removePageSpinner } from "../../store/actions/spinner";
import uuid from 'react-uuid';
import Api from '../../Api';
import AlertService from '../../Services/AlertService';

function Colors() {
  const dispatch = useDispatch();

  const [color, setColor] = useState("");
  const [colors, setColors] = useState([]);
  const [colorId, setColorId] = useState(null);
  const [isinvalidSubmit, setIsinvalidSubmit] = useState(false);

  const onChange = (event) => {
    setColor(event.target.value);
  }

  const getColors = () => {
    const spinnerId = uuid();
    dispatch(addPageSpinner(spinnerId));
    Api.getColors().then(response => {
      dispatch(removePageSpinner(spinnerId));
      if (response.data.colors) {
        setColors(response.data.colors)
      }
    }).catch(error => getFail(error, spinnerId));
  }

  const cancelUpdate = () => {
    setColor("");
    setColorId(null);
  }

  useEffect(() => {
    getColors();
  }, [])

  const onSubmit = (event) => {
    event.preventDefault();
    const spinnerId = uuid();
    if (!color) {
      setIsinvalidSubmit(true);
    } else {
      dispatch(addPageSpinner(spinnerId));
      (!colorId ? Api.addColor(color) : Api.updateColor(colorId, color)).then(response => {
        dispatch(removePageSpinner(spinnerId));
        const data = { ...response.data };
        data && AlertService.alert("success", data.message);
        setColor("");
        setColorId(null);
        getColors();
      }).catch(error => getFail(error, spinnerId));
    }
  }

  const getColorById = (id) => {
    const spinnerId = uuid();
    dispatch(addPageSpinner(spinnerId));
    Api.getColorById(id).then(response => {
      dispatch(removePageSpinner(spinnerId));
      if (response.data?.color) {
        setColor(response.data.color.color);
        setColorId(response.data.color._id);
      }
    }).catch(error => getFail(error, spinnerId));
  }

  const removeColorById = (color) => {
    const spinnerId = uuid();
    AlertService.alertConfirm(`Вы действительно хотите удалить ${color.color} ?`, "Да", "Нет").then(() => {
      dispatch(addPageSpinner(spinnerId));
      Api.removeColorById(color._id).then(response => {
        dispatch(removePageSpinner(spinnerId))
        const data = { ...response.data };
        data && AlertService.alert("success", data.message);
        const newColors = colors.filter(function (obj) {
          return obj._id !== color._id;
        });
        setColors(newColors);
        setColor("");
        setColorId(null);
      })
    })
  }

  const getFail = (message, spinnerId) => {
    message && AlertService.alert("error", message);
    spinnerId && dispatch(removePageSpinner(spinnerId));
  }

  return (
    <div className='content'>
      <h2 className="title">{colorId ? "Обновить цвет" : "Добавить цвет"}</h2>
      <form onSubmit={onSubmit}>
        <div className="add-category-block">
          <label htmlFor="color">Название цвета <span className="red">*</span> </label>
          <input
            id="color"
            type="text"
            name="color"
            value={color}
            autoComplete="off"
            onChange={onChange}
            placeholder="Название цвета"
            className={`pl-2 mt-1 mb-3 ${isinvalidSubmit && !color ? "error" : ""}`}
          />
          <div className="category-butttons-block">
            <button type="submit" className="btn btn-outline-primary admin-button">
              {
                colorId ? "Обновить название цвета" : "Добавить цвет"
              }
            </button>
            {
              colorId ?
                <div className="reset" title="Отменить обнавление данного цвета" onClick={cancelUpdate}>
                  <BiReset />
                </div>
                : null
            }
          </div>
        </div>
        <hr className="my-2" />
      </form>
      {
        colors.length ?
          <table id="customers">
            <thead>
              <tr>
                <th>Название цвета</th>
                <th>Обновить</th>
                <th>Удалить</th>
              </tr>
            </thead>
            <tbody>
              {
                colors ? colors.map(color => {
                  return <tr key={color._id}>
                    <td>{color.color}</td>
                    {/* <td>
                      {
                        <img className="td-img" src={`${getImageUrl}/${JSON.parse(category.images)[0]}`} alt="#" />
                      }
                    </td> */}
                    <td className="center blue icon" onClick={() => getColorById(color._id)}><MdUpdate /></td>
                    <td className="center red icon" onClick={() => removeColorById(color)}><RiDeleteBin2Fill /></td>
                  </tr>
                }) : null
              }
            </tbody>
          </table>
          : null
      }
    </div>
  )
}

export default Colors;