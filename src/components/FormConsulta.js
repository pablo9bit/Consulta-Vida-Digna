import { useState, createRef } from "react";
import firebase from "../config/firebase";
import ReCAPTCHA from "react-google-recaptcha";

import useAlerta from "../hooks/useAlerta";

const FormConsulta = () => {
  const [resultado, setResultado] = useState({ data: null, consultado: false });
  const [setAlerta, MostrarAlerta] = useAlerta(null);
  const [DatosForm, LeerForm] = useState({ cuil: "" });
  const { cuil } = DatosForm;

  const recaptchaRef = createRef();

  const onChange = (e) => {
    LeerForm({
      ...DatosForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAlerta(null);

    const recaptchaValue = recaptchaRef.current.getValue();

    if (recaptchaValue) {
      if (cuil.trim().length < 7) {
        setAlerta({
          msg: "Debe ingresar su Número de DNI",
          class: "danger",
        });
      } else {
        buscar(cuil);
      }
    } else {
      setAlerta({
        msg: "Debe validar reCAPTCHA",
        class: "danger",
      });
    }
  };

  const buscar = async (micuil) => {
    setResultado({ data: null, consultado: false });
    const db = firebase.database();
    const ref = db.ref("/");

    ref
      .orderByChild("NUMD_Q01")
      .equalTo(parseInt(micuil))
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          const data = snapshot.val();
          const key = Object.keys(snapshot.val())[0];
          setResultado({ data: data[key], consultado: true });
        } else {
          setAlerta({
            msg: "No se encontraron resultados.",
            class: "danger",
          });
        }
      });
  };

  const convertirAFecha = (fecha) => {
    const dia = fecha.toString().substring(6, 8);
    const mes = fecha.toString().substring(4, 6);
    const ano = fecha.toString().substring(0, 4);
    return dia + "/" + mes + "/" + ano;
  };

  return (
    <div>
      <img src="header_banco_gente.png" width="100%" alt="bancodelagente" />
      <br></br>
      <div className="text-center p-1">
        <b>CONSULTA DE COBRO DE VIDA DIGNA</b>
      </div>
      <form onSubmit={onSubmit} style={{ margin: "30px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            style={{ width: "400px" }}
            type="text"
            name="cuil"
            className="form-control"
            id="cuil"
            placeholder="Ingrese su DNI"
            onChange={onChange}
            value={cuil}
          />
        </div>
        <br></br>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <ReCAPTCHA
            //https://bancodelagente-cba-gov-ar.web.app/
            //sitekey="6LfsQhQcAAAAACwwTgk47g1TVusF8mhGb4eRC_lO"
            sitekey="6LeH_HUbAAAAAApK164OIBLZOX0uOaZWiXYRZjw_"
            ref={recaptchaRef}
            onChange={onChange}
          />
        </div>
        <br></br>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="btn btn-primary" type="submit">
            consultar
          </button>
        </div>
      </form>
      <MostrarAlerta />
      {resultado.data ? (
        <table
          className="table table-striped "
          style={{ margin: "auto", width: "600px" }}
        >
          <tbody>
            <tr>
              <th scope="row">DNI</th>
              <td>{resultado.data.NUMD_Q01}</td>
            </tr>
            <tr>
              <th scope="row">Apellido y Nombre</th>
              <td>{resultado.data.APEN_Q01}</td>
            </tr>
            <tr>
              <th scope="row">Periodo de Cobro</th>
              <td>
                 {" Desde " + convertirAFecha(resultado.data.FDES_Q01) +
                  " Hasta " +
                  convertirAFecha(resultado.data.FHAS_Q01)} 
              </td>
            </tr>
            <tr>
              <th scope="row">Sucursal Bancaria</th>
              <td>
                {resultado.data.SUCU_Q01} - Dir.: {resultado.data.DOMICILIO}
              </td>
            </tr>
            <tr>
              <th scope="row">Cobrado</th>
              <td>
                {resultado.data.FECP_Q01 === 0 ? "No" : "Si"}
              </td>
            </tr>
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default FormConsulta;
