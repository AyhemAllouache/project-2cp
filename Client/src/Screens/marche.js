import axios from 'axios'
import React, { useEffect, useState  } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import '../Bootstrab/Acceil/sb-admin-2.css'
import Navbar from '../Components/Navbar'
import ScrollTopButton from '../Components/ScollTopButton'
import Sidebar from '../Components/Sidebar'

import { ModifyDossier } from '../Redux/FunctionRedux/Dossies'
import { AddUser } from '../Redux/FunctionRedux/User'

const dateCourant = new Date().getDate().toString() + '/' +   ( new Date().getMonth() + 1).toString() + '/' + new Date().getFullYear().toString();
//const id = "609a3694bcbe4715504c7fb2";

const Marche = (props) => {

    const id  = props.match.params.id ;
    const history = useHistory()
        
    // redux
        const Docs = useSelector(state => state.dossiers.Dossiers)
        const Dossier = Docs.filter(doc =>{ return doc._id === id}).length > 0 ? Docs.filter(doc =>{ return doc._id === id})[0] : {marche : {}};
        if (Docs.filter(doc =>{ return doc._id === id}).length === 0) history.push('/')
        const user = useSelector(state => state.user);
        const dispatch = useDispatch();

    // check if user EXiste
    if (!user.existe) {
      axios.get("http://localhost:4000/checkUser",{withCredentials : true}).then(res => {
      if (res.data.existe) {
          dispatch(AddUser(res.data.user));
      }else {
          history.push('/login');
      }
  })
  }

  const handlerDateLancement = (type) => {
    if (!Dossier.marche.data_ouverture ) {
        axios.post(`http://localhost:4000/dossiers/marche/${id}`,{
            data_ouverture : dateCourant,
            type,
        }).then(res => {dispatch(ModifyDossier(res.data))});
    }
}

  useEffect(()=> {
    if (user.existe) {
        handlerDateLancement(0);
        if (user.user.service != 'marche' && user.user.service != 'ordonnateur' )  {
            history.push('/')
        }
        if (!user.user.compte.includes('miseAjour') && user.user.service != 'ordonnateur') {
            history.push('/')
        }   
    }
},[user])
        

    const [type_prestation, settype_prestation] = useState(Dossier.marche.type_prestation ? Dossier.marche.type_prestation : 'Marchés');
    const [objet, setobjet] = useState(Dossier.marche.objet ? Dossier.marche.objet : '');
    const [date_lancement, setdate_lancement] = useState(Dossier.marche.date_lancement ? Dossier.marche.date_lancement : '');
    const [data_ouverture, setdata_ouverture] = useState(Dossier.marche.data_ouverture ? Dossier.marche.data_ouverture : dateCourant);
    const [observation, setobservation] = useState(Dossier.marche.observation ? Dossier.marche.observation : '');
    const [fournisseur, setfournisseur] = useState(Dossier.marche.fournisseur ? Dossier.marche.fournisseur : '');
    const [data_transm, setdata_transm] = useState(Dossier.marche.data_transm ? Dossier.marche.data_transm : '');
    const [decision, setdecision] = useState(Dossier.marche.decision ? Dossier.marche.decision : '');
    const [num_convention, setnum_convention] = useState(Dossier.marche.num_convention ? Dossier.marche.num_convention : '');
    const [respo_dossier, setrespo_dossier] = useState(Dossier.marche.respo_dossier ? Dossier.marche.respo_dossier : '');
    const [duree_trait, setduree_trait] = useState(Dossier.marche.duree_trait ? Dossier.marche.duree_trait : '');
    const [num_dossier , setnum_dossier] = useState(Dossier.num_dossier)

    const handlerClick = (e,type) => {
        e.preventDefault();
        axios.post(`http://localhost:4000/dossiers/marche/${id}`,{
            type_prestation ,
            objet,
            date_lancement,
            data_ouverture ,
            observation,
            fournisseur,
            data_transm : type === 1 ? dateCourant : 'pas de transmaton Encore',
            decision,
            num_convention,
            respo_dossier,
            type,
            id : user.user._id,
            idDossier : id
        }).then(res => {dispatch(ModifyDossier(res.data))});
        history.push('/');
    }
    const [color , setcolor ] = useState('#1a1a2e');
    const [color1 , setcolor1 ] = useState('#1a1a2e');
    const [color2 , setcolor2 ] = useState('#1a1a2e');

    return(
        <div className='marche'>
        <div id="wrapper">
        <ScrollTopButton />
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
            <Navbar />
                <div className="container-fluid" style={{textAlign : 'center'}}>
                <h3 style={{margin : '1rem'}}>
                    Service Marchés
                </h3>
                 <div id='main'>
                    <form >
                    <div id='form'>
                     <div className='div'>
                     <div><label htmlFor="numdoss">N° de dossier</label></div>
                     <div><input type="text" id="numdoss" disabled name="numdoss" value={num_dossier} /></div>
                      </div>
                     <div className='div'>
                     <div><label htmlFor="type">Type de prestation</label></div>
                     <div >
                      <select className='selectMarch' name="type" id="type"  onChange={(e) => settype_prestation(e.target.value)}>
                        <option value="Marchés">Marchés</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Gré-à-Gré">Gré-à-Gré</option>
                     </select>
                     </div>
                      </div>
                     <div className='div'>
                     <div><label htmlFor="objet">Objet</label></div>
                     <div><input type="text" id="objet" name="objet" 
                                 value={objet} onChange={(e) => setobjet(e.target.value)}
                     /></div>
                      </div>
                     <div className='div'>
                        <div><label htmlFor="datelanc">date de Lancement</label></div> 
                        <div><input type="text" id="datelanc" name="datelanc" 
                                  disabled  value={date_lancement} onChange={(e) => setdate_lancement(e.target.value)}
                        /></div></div>
                     <div className='div'>
                        <div><label htmlFor="dateover">date de D'ouverture</label></div> 
                        <div><input  type="text" id="dateover" name="dateover" 
                                    value={data_ouverture} onChange={(e) => setdata_ouverture(e.target.value)}
                                    disabled={true}
                        /></div></div>
                      <div className='div'>
                       <div> <label htmlFor="fourn">Fournisseur</label></div>
                       <div> <input type="text" id="fourn" name="fourn" 
                                    value={fournisseur} onChange={(e) => setfournisseur(e.target.value)}
                       /></div></div>
                     <div className='div'>
                     
                       <div> <label htmlFor="dec">décision</label></div>
                       <div> <input type="text" id="dec" name="dec"
                                    value={decision} onChange={(e) => setdecision(e.target.value)}
                       /></div></div>
                 
                     <div className='div'>
                       <div> <label htmlFor="numcon">N° Convention</label></div>
                        <div> <input type="text" id="numcon" name="numcon"  
                                        value={num_convention} onChange={(e) => setnum_convention(e.target.value)}
                        /></div></div>
                     
                         <div className='div'> 
                      <div> <label htmlFor="respodos">responsable du dossier</label></div>
                      <div>  <input type="text" id="respodos" name="respodos" 
                                    value={respo_dossier} onChange={(e) => setrespo_dossier(e.target.value)}
                       /></div></div>
                      
                       <div id='tear'>
                        <div> <label htmlFor="obs">observations</label></div>
                      <div> <textarea id="obs" name="obs" rows='3'
                                value={observation} onChange={(e) => setobservation(e.target.value)}
                      > </textarea></div></div>
                    </div>  
                    <div id='bottuns'>
                 <input onClick={(e) => {handlerClick(e,0)}} type="submit" className='btnEdit' value="Enregistrer" onMouseEnter={()=>setcolor('#16213e')} onMouseLeave={()=>setcolor("#1a1a2e")}  style={{backgroundColor : `${color}` }} />
                  <input type="submit" onClick={(e) => {handlerClick(e,2)}} className='btnEdit' value="Annuler Le Dossier" onMouseEnter={()=>setcolor1('#16213e')} onMouseLeave={()=>setcolor1("#1a1a2e")}  style={{backgroundColor : `${color1}` }} />
                  <input type="submit" onClick={(e) => {handlerClick(e,1)}} className='btnEdit' value='Transmettre' onMouseEnter={()=>setcolor2('#16213e')} onMouseLeave={()=>setcolor2("#1a1a2e")}  style={{backgroundColor : `${color2}` }} />
                  </div>
                    </form>
               
                 </div>
                 
                </div>
        </div>      
        </div>
        </div>
        </div>
    )
}
export default Marche