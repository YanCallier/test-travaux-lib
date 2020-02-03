import React from 'react';
import devis from './devis.json';
import './App.css';

class TitleDevis extends React.Component {
  render() {
    return (
      <h1 className='big-blue'>{devis.title}</h1>
    );
  }
}

class ClientInfo extends React.Component {
  render() {
    return (
      <div className='margin-right-20'>
        <strong className='big-blue'>Envoyé à :</strong><br />
        {devis.deal.customerName}<br />
        {devis.deal.billingAddress.address}<br />
        {devis.deal.billingAddress.postalCode + ' ' + devis.deal.billingAddress.city}<br />
        {devis.deal.customerEmail}<br />
      </div>
    );
  }
}

class CompagnyInfo extends React.Component {
  render() {
    return (
      <div className='margin-bottom-20'>
        <strong className='big-blue'>Société</strong><br />
        {devis.company.name}<br />
        {devis.company.address}<br />
        {devis.company.postalCode + ' ' + devis.company.city}<br />
        {devis.company.phoneNumber}<br />
        {devis.company.email}<br />
        Siret : {devis.company.siret}<br />
      </div>
    );
  }
}

class ChantierInfo extends React.Component {
  render() {
    return (
      <div className='margin-right-20'>
        <strong className='big-blue'>Adresse du chantier : </strong><br />
        {devis.deal.chantierAddress.address}<br />
        {devis.deal.chantierAddress.postalCode + ' ' + devis.deal.billingAddress.city}
      </div>
    );
  }
}

class DateInfos extends React.Component {
  render() {
    return (
      <div className='margin-right-20'>
        <strong className='big-blue'>Date du devis : </strong>{devis.date}<br />
        <strong className='big-blue'>Durée de validité : </strong>{devis.dureeValidite.quantity + ' ' + devis.dureeValidite.unit}<br />
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div className='header margin-bottom-20'>
        <CompagnyInfo />
        <ClientInfo />
        <ChantierInfo />
        <DateInfos />
      </div>
    );
  }
}

class CategoryRow extends React.Component {
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan="9" className='big-blue category-row'>
          {category}
        </th>
      </tr>
    );
  }
}

class PrestationRow extends React.Component {
  render() {
    // console.log(this.props);
    return (
      <tr className='prestation-row'>
        <td className='prestations-designation'>{this.props.designation}</td>
        <td className='prestations-description'>{this.props.description}</td>
        <td className='prestations-center'>{this.props.prixUnitaireHT}</td>
        <td className='prestations-center'>{this.props.quantite}</td>
        <td className='prestations-center'>{this.props.unite}</td>
        <td className='prestations-center'>{this.props.prixHT}</td>
        <td className='prestations-center'>{this.props.tauxTVA}</td>
        <td className='prestations-center'>{this.props.montantTVA}</td>
        <td className='prestations-center'>{this.props.prixTTC}</td>
      </tr>
    );
  }
}

class TotalRow extends React.Component {
  render() {
    return (
      <tr>
        <th colSpan="9" className='total-row'>
          {"Total HT " + this.props.category + " : " + this.props.totalHT}<br />
          {"Total TTC " + this.props.category + " : " + this.props.totalTTC}
        </th>
      </tr>
    );
  }
}

class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleCategoryChange(e) {
    this.props.onCategoryChange(e.target.value);
  }

  render() {
    return (
      <div>
        Trier par :<br />
        <select name="switcher" id="switcher" onChange={this.handleCategoryChange} value={this.props.category} >
          <option value="lots">Lots</option>
          <option value="locations">Localisations</option>
        </select>
      </div>
    );
  }
}

class Prestations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'lots',
    };

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleCategoryChange(category) {
    this.setState({
      category: category
    });
  }

  render() {

    const prestations = [];
    devis.lots.forEach((lot) => {
      lot.lignes.forEach((ligne) => {
        ligne.lots = lot.label;

        let places = ligne.locationsDetails.locations;
        if (places.length === 0) {
          ligne.locations = "Autres prestations";
        }
        if (places.length === 1) {
          let matchLoc = devis.locations.find(loc => loc.uuid === places[0].uuid);
          ligne.locations = matchLoc.label;
        }
        if (places.length > 1) {
          if (this.state.category === "locations") {
            const ligneSup = [];
            // for (let i = 0; i < places.length; i++) {
            // let locationLigne = ligne;
            // locationLigne.quantite = places[i].quantite;
            // console.log(places[i].quantite);
            // locationLigne.prixHT = ligne.prixUnitaireHT * locationLigne.quantite;
            // locationLigne.montantTVA = (ligne.tauxTVA / 100) * locationLigne.prixHT;
            // locationLigne.prixTTC = locationLigne.prixHT + locationLigne.montantTVA;
            // let matchLoc = devis.locations.find(loc => loc.uuid === places[i].uuid);
            // locationLigne.locations = matchLoc.label;
            // igneSup.push(locationLigne);
            // }
            for (let i = 0; i < places.length; i++) {
              let locationLigne = {};
              locationLigne.designation = ligne.designation;
              locationLigne.description = ligne.description;
              locationLigne.normalizedIdentifier = ligne.normalizedIdentifier;
              locationLigne.prixUnitaireHT = ligne.prixUnitaireHT;
              locationLigne.quantite = places[i].quantite;
              locationLigne.unite = ligne.unite;
              locationLigne.uniteLabel = ligne.uniteLabel;
              locationLigne.prixHT = ligne.prixUnitaireHT * locationLigne.quantite;
              locationLigne.tauxTVA = ligne.tauxTVA;
              locationLigne.montantTVA = parseFloat(((ligne.tauxTVA / 100) * locationLigne.prixHT).toFixed(1));
              locationLigne.prixTTC = (locationLigne.prixHT + locationLigne.montantTVA).toFixed(1);
              locationLigne.uuid = ligne.uuid + i;
              locationLigne.lots = ligne.lots;
              let matchLoc = devis.locations.find(loc => loc.uuid === places[i].uuid);
              locationLigne.locations = matchLoc.label;

              ligneSup.push(locationLigne);
            }

            ligne = ligneSup[0];
            for (let i = 1; i < ligneSup.length; i++) {
              prestations.push(ligneSup[i]);
            }
          }
        }
        prestations.push(ligne);
      })
    });

    const rows = [];

    let autresPrestations = devis.locations.find(loc => loc.label === "Autres prestations");
    if (!autresPrestations) {
      devis.locations.push({ "label": "Autres prestations" })
    }

    devis[this.state.category].forEach((category) => {
      rows.push(
        <CategoryRow
          category={category.label}
          key={category.label}
        />
      );
      let totalPrestationsHT = 0;
      let totalPrestationsTTC = 0;
      prestations.forEach((prestation) => {
        if (prestation[this.state.category] === category.label) {
          rows.push(
            <PrestationRow
              key={prestation.uuid}
              designation={prestation.designation}
              description={prestation.description}
              prixUnitaireHT={prestation.prixUnitaireHT}
              quantite={prestation.quantite}
              unite={prestation.unite}
              prixHT={prestation.prixHT}
              tauxTVA={prestation.tauxTVA}
              montantTVA={prestation.montantTVA}
              prixTTC={prestation.prixTTC}
            />
          );
          totalPrestationsHT += parseFloat(prestation.prixHT)
          totalPrestationsTTC += parseFloat(prestation.prixTTC);
        }
      });
      rows.push(
        <TotalRow
          category={category.label}
          key={'total' + category.label}
          totalHT={totalPrestationsHT.toFixed(1)}
          totalTTC={totalPrestationsTTC.toFixed(1)}
        />
      );
    });

    return (
      <div>
        <Switcher category={this.state.category} onCategoryChange={this.handleCategoryChange} />
        <table className='prestations'>
          <thead>
            <tr>
              <th>Designation</th>
              <th>Description</th>
              <th>Prix Unitaire HT</th>
              <th>Quantité</th>
              <th>Unité</th>
              <th>Prix HT</th>
              <th>Taux TVA</th>
              <th>Montant TVA</th>
              <th>Prix TTC</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

class ShowPresta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
    this.handleClickPresta = this.handleClickPresta.bind(this);
  }

  handleClickPresta(e) {
    this.setState({
      show: !this.state.show
    });
  }

  render() {

    return (
      <div >
        <h2 onClick={this.handleClickPresta} className='show-presta-button'>
          <div>Détails des prestations</div>
          <div className={this.state.show ? "rotate-90" : "rotate90"}>&#10097;</div>
        </h2>
        {this.state.show && <Prestations />}
      </div>
    );
  }
}


class Modalite extends React.Component {
  render() {
    return (
      <div className='margin-bottom-20'>
        <strong>{this.props.label}</strong><br />
        Pourcentage : {this.props.pourcentage} %<br />
        Montant : {this.props.montant} €<br />
      </div>
    );
  }
}

class Modalites extends React.Component {
  render() {
    const elements = [];
    let index = 0;
    devis.modalitesPaiement.forEach((modalite) => {
      index++
      elements.push(
        <Modalite
          label={modalite.label}
          montant={modalite.montant}
          pourcentage={modalite.pourcentage}
          key={'modalite' + index}
        />
      );
    });
    return (
      <div>
        <h2>Modalités de paiement</h2>
        {elements}
      </div>
    );
  }
}

class PxTotal extends React.Component {
  render() {
    return (
      <div className='total'>
        Total avant remise : {devis.prixTotalHTAvantRemise} €<br />
        Remise : {devis.montantRemise} €<br />
        Prix total HT : {devis.prixTotalHT} €<br />
        Dont fournitures : {devis.prixTotalFournitureHT} €
        <h2>{'Prix total TTC : ' + devis.prixTotalTTC + ' €'}</h2>
      </div>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div className='footer'>
        <Modalites />
        <PxTotal />
      </div>
    );
  }
}

function App() {

  return (
    <div>
      <TitleDevis />
      <Header />
      <ShowPresta />
      <Footer />
    </div>
  );
}

export default App;