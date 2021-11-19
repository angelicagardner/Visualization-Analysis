import React, { useEffect, useState } from 'react';
import { LocationRepository } from '../../repositories/location.repository';
import MapToolTip from './MapToolTip';

function CustomMap({ timeRange, selected, updateLocation, filter }) {
  const [mapInfo, setMapInfo] = useState({
    locations: {
      palacehills: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      northwest: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      oldtown: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      safetown: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      southwest: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      downtown: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      wilsonforest: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      scenicvista: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      broadview: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      chapparal: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      terrapinsprings: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      peppermill: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      cheddarford: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      easton: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      weston: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      southton: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      oakwillow: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      eastparton: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
      westparton: { style: { fill: '#fff', fillOpacity: 0.1 }, text: '' },
    },
    legend: {
      start: {
        value: 0,
        color: '#FFF',
      },
      end: {
        value: 0,
        color: '#FFF',
      },
    },
  });

  const [tooltip, setTooltip] = useState({
    title: '',
    id: '',
    position: { left: 0, top: 0 },
    visible: false,
    totalMessages: 0,
  });

  useEffect(() => {
    const repository = new LocationRepository();
    const loadData = async (start, end) => {
      let data;

      if (start && end) data = (await repository.getRange(start, end)).data;
      else data = (await repository.getAll()).data;

      const max = Math.max(...data.map((item) => item.id));

      const getColor = () => {
        return filter.color ?? 0;
      };

      setMapInfo({
        locations: data.reduce(
          (acc, cur) => ({
            ...acc,
            ...{
              [cur.location.toLowerCase().replace(' ', '')]: {
                style: {
                  fill: `hsl(${getColor()},${(cur.id / max) * 100}%,60%)`,
                  fillOpacity: 1,
                },
                text: cur.id,
              },
            },
          }),
          {}
        ),
        legend: {
          start: {
            value: 0,
            color: `hsl(${getColor()},0%,60%)`,
          },
          end: {
            value: max,
            color: `hsl(${getColor()},100%,60%)`,
          },
        },
      });
    };

    loadData(timeRange.start, timeRange.end);
  }, [timeRange, filter]);

  const setLocation = (e, title, id, totalMessages) => {
    setTooltip({
      position: {
        left: e.nativeEvent.x,
        top: e.nativeEvent.y,
      },
      totalMessages,
    });
    updateLocation({ name: title, id });
  };

  return (
    <div className="map">
      <MapToolTip
        title={selected.name}
        position={tooltip.position}
        visible={selected.id !== undefined ? true : false}
        closeCallback={() => updateLocation({ name: undefined, id: undefined })}
      >
        Number of messages: <strong>{tooltip.totalMessages}</strong>
      </MapToolTip>
      <svg
        className="canvas"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="35 0 450 385"
      >
        <path
          className={selected?.id === 'palacehills' ? 'active' : ''}
          d="M108.64936786328326,140.71532889866253L97.23948212165851,140.59113920416652L98.00014117109822,163.73698560142572L83.54761923168553,168.9063777811061L68.8467188271461,205.34048270738475L51.460226268478436,203.66392468248932L53.8042980330938,188.9629917950735L64.15857529794448,186.2929168375045L67.96187054514303,166.4691569348135L59.39281349838711,150.60393182399335L39.77091475354973,148.92737140820992L39.77091475354973,142.03484437329308L53.75772707085707,140.9947557095059L49.58186412596842,132.00652541361723L43.946777698467486,107.57218664374511L48.324448146275245,95.88281657046764L59.1910059954389,86.27362285527812L69.42109402775532,81.6785952401961L81.34326035369304,74.89471853636587L90.56431087147212,72.65929881963257L103.47999105791678,73.85462744247042L108.68041517143138,73.24920126388639Z"
          id="map_palacehills"
          style={mapInfo.locations.palacehills.style}
          onClick={(e) =>
            setLocation(
              e,
              'Palace Hills',
              'palacehills',
              mapInfo.locations.northwest.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'northwest' ? 'active' : ''}
          d="M108.64936786328326,140.71532889866253L108.68041517143138,73.24920126388639L113.04256196517963,69.60112013908463L120.64915245960583,70.67225890677219L120.52496322707157,78.43413269011086L131.3449501139985,76.29185576034018L135.36557651823387,72.14701510695437L142.07179507659748,70.40835515661246L156.10517835608334,67.6761749928782L161.55398093472468,72.65929881963257L169.70389932161197,71.27768514669236L179.53037234809017,68.73179009131115L181.0672141010582,71.71235013054604L183.14738374648732,76.13661829476422L183.6441406767117,121.48144418276871L182.09177526968415,121.23306464099852L171.64435608038912,122.73886558167408L167.12697274592938,121.5590627891574L155.6394687339489,118.74926911067104L143.9501572190784,118.9200300599598L139.18439541946282,125.93675186831439L138.43926002411172,132.36357087957512L135.39662382635288,136.9741141440427L133.42511975942762,140.20304640587835L128.41097949474351,143.3233123737823L124.39035309050814,143.27674124213985L108.77355709587573,142.34531859490403Z"
          id="map_northwest"
          style={mapInfo.locations.northwest.style}
          onClick={(e) =>
            setLocation(
              e,
              'Northwest',
              'northwest',
              mapInfo.locations.northwest.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'oldtown' ? 'active' : ''}
          d="M179.53037234809017,68.73179009131115L179.6079906184459,53.7513657276574L188.03733477857895,47.15376656580969L199.40064955802518,46.998528916348164L212.28528243635083,38.289695127056746L233.13354985270416,30L234.20468198356684,49.51337871187377L239.80872110289056,52.46289356434153L252.64678301903768,47.37109927333768L260.39308640005765,58.06697078459132L268.4188155544107,72.24015760095125L276.4445447087055,71.16901889957671L275.1095104586857,60.73705698261625L269.48994768521516,54.06184093738602L272.7033440777741,46.299959481087285L271.36830982772517,36.95465079779183L294.34331785174436,35.34017848141616L294.88664574417635,46.03605546680029L300.22678274437203,52.18346585712186L301.4841987240361,54.9932665425178L291.4714418487274,88.1364716619168L289.46889047368313,100.16736712300667L281.07059362164,111.99644896428146L273.54162139756954,125.43999285542742L251.1875595364254,125.43999285542742L240.16576514652115,129.15016153977234L235.85018931498053,129.35196986551475L227.6381763118261,126.63531921660785L214.8311617038562,126.77503268436476L204.01117481687106,122.84753162604557L194.38650929334108,124.12047668833787L183.6441406767117,121.48144418276871L183.14738374648732,76.13661829476422Z"
          id="map_oldtown"
          style={mapInfo.locations.oldtown.style}
          onClick={(e) =>
            setLocation(
              e,
              'Old Town',
              'oldtown',
              mapInfo.locations.oldtown.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'safetown' ? 'active' : ''}
          d="M300.22678274437203,52.18346585712186L303.533321061288,44.76310665027313L307.088237843418,45.71005638623569L309.33916768355994,56.173072257351805L333.5560680331837,84.1623940502194L328.12278910860186,87.4999983342604L331.05675972785684,91.25674312347303L343.16520990265417,89.17656218927675L359.29428648168687,73.68386621406898L362.77158499337384,77.56480294288991L352.355213112256,92.26578605634711L360.76903361835866,100.8193638884112L354.21805160070653,105.08838995501696L364.3860450167267,119.52545523596922L364.64994713588385,134.50584359058834L363.39253115619067,139.5820979189825L368.4066714209039,147.93385408552652L372.08577743556816,156.62712967707665L385.79316397960065,160.2907237374542L377.44143808979425,166.98143903698139L377.42591443570564,170.53636615527788L364.7586127144168,174.15338772169778L253.14353994926205,173.12882370820205L253.29877648994443,152.29601586350145L264.46028376647155,140.59113920416652L273.54162139756954,125.43999285542742L281.07059362164,111.99644896428146L289.46889047368313,100.16736712300667L291.4714418487274,88.1364716619168L301.4841987240361,54.9932665425178Z"
          id="map_safetown"
          style={mapInfo.locations.safetown.style}
          onClick={(e) =>
            setLocation(
              e,
              'Safe Town',
              'safetown',
              mapInfo.locations.safetown.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'southwest' ? 'active' : ''}
          d="M98.00014117109822,163.73698560142572L97.23948212165851,140.59113920416652L108.64936786328326,140.71532889866253L108.77355709587573,142.34531859490403L124.39035309050814,143.27674124213985L124.15749827949912,172.13530706243233L129.34239873895422,172.21292555131822L129.59077720408095,188.91642072174142L166.81649966456462,188.69908904548458L166.9562125512166,191.10526111108905L175.77364806309924,200.5902348040134L194.09155986597762,221.45406503292588L203.04870826451224,235.48746957302671L212.93727590731578,247.37860371320832L214.2723101573356,252.33065493089504L207.2090475553705,252.48589163954392L180.7101700574567,248.0926926291585L153.31092062342213,232.55349482455063L138.43926002411172,229.71266197535547L104.65978876725421,204.87477215126805L97.9535702088906,187.4416700385398L102.36228796487558,163.876698913252Z"
          id="map_southwest"
          style={mapInfo.locations.southwest.style}
          onClick={(e) =>
            setLocation(
              e,
              'Southwest',
              'southwest',
              mapInfo.locations.southwest.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'downtown' ? 'active' : ''}
          d="M166.81649966456462,188.69908904548458L129.59077720408095,188.91642072174142L129.34239873895422,172.21292555131822L124.15749827949912,172.13530706243233L124.39035309050814,143.27674124213985L128.41097949474351,143.3233123737823L133.42511975942762,140.20304640587835L138.43926002411172,132.36357087957512L139.18439541946282,125.93675186831439L143.9501572190784,118.9200300599598L155.6394687339489,118.74926911067104L167.12697274592938,121.5590627891574Z"
          id="map_downtown"
          style={mapInfo.locations.downtown.style}
          onClick={(e) =>
            setLocation(
              e,
              'Downtown',
              'downtown',
              mapInfo.locations.downtown.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'wilsonforest' ? 'active' : ''}
          d="M460.2290852465085,298.8240334627437L432.87640677471063,298.8240334627437L432.2554606118938,168.09914541682087L452.59144744390505,154.99714067107107L460.21356159239076,159.80948894616972Z"
          id="map_wilsonforest"
          style={mapInfo.locations.wilsonforest.style}
          onClick={(e) =>
            setLocation(
              e,
              'Wilson Forest',
              'wilsonforest',
              mapInfo.locations.wilsonforest.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'scenicvista' ? 'active' : ''}
          d="M460.2290852465085,298.8240334627437L460.19803793836036,308.0761350157758L408.861313928006,323.5221752754823L318.3739343524794,363.4490178679263L313.949692942464,358.93163439415116L314.19807140759076,346.7300415721575L329.4888706667698,346.8231835044106L342.34245623697643,336.3757631640972L349.20391133602243,332.8674168198181L356.12746105136466,332.8674168198181L409.00102681462886,303.2017057818024L414.2790691984992,303.6674155913727L414.1083090037573,299.15003034449376L417.53903655326576,293.2199916480311L432.8453594665625,292.89399474496884L432.87640677471063,298.8240334627437Z"
          id="map_scenicvista"
          style={mapInfo.locations.scenicvista.style}
          onClick={(e) =>
            setLocation(
              e,
              'Scenic Vista',
              'scenicvista',
              mapInfo.locations.scenicvista.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'broadview' ? 'active' : ''}
          d="M318.3739343524794,363.4490178679263L315.1605379599496,369.06858074472785L297.7895690552832,370L274.5351352581056,358.23306993415014L255.42551709761028,353.60702080242106L249.41786297239014,346.09357170071905L242.57193152740365,324.03445597428595L220.51281909356476,302.6428540073988L204.97364136925898,293.79436714095107L208.97874411937664,283.766080950728L209.8170214391721,269.9034479317178L207.81447006412782,262.04847214272354L213.32536725900718,259.7820165049104L253.88867534461315,260.60477095794806L254.05943553938414,275.5230150450545L335.8225215274433,275.6316807031713L334.93767324544024,312.90399304723445L332.00370262618526,316.30367430109277L323.7140713526169,319.05136181815567L318.09450857920456,320.9142007777782L314.8811121866456,324.3294054666505L314.19807140759076,346.7300415721575L313.949692942464,358.93163439415116Z"
          id="map_broadview"
          style={mapInfo.locations.broadview.style}
          onClick={(e) =>
            setLocation(
              e,
              'Broadview',
              'broadview',
              mapInfo.locations.broadview.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'chapparal' ? 'active' : ''}
          d="M335.8225215274433,275.6316807031713L334.76691305066925,254.44187413455782L367.63048871740466,254.79891855148438L368.4842896912887,325.94386583446834L356.12746105136466,332.8674168198181L349.20391133602243,332.8674168198181L342.34245623697643,336.3757631640972L329.4888706667698,346.8231835044106L314.19807140759076,346.7300415721575L314.8811121866456,324.3294054666505L318.09450857920456,320.9142007777782L332.00370262618526,316.30367430109277L334.93767324544024,312.90399304723445Z"
          id="map_chapparal"
          style={mapInfo.locations.chapparal.style}
          onClick={(e) =>
            setLocation(
              e,
              'Chapparal',
              'chapparal',
              mapInfo.locations.chapparal.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'terrapinsprings' ? 'active' : ''}
          d="M368.4842896912887,325.94386583446834L367.63048871740466,254.79891855148438L432.659075617732,254.56606349719672L432.8453594665625,292.89399474496884L417.53903655326576,293.2199916480311L414.1083090037573,299.15003034449376L414.2790691984992,303.6674155913727L409.00102681462886,303.2017057818024Z"
          id="map_terrapinsprings"
          style={mapInfo.locations.terrapinsprings.style}
          onClick={(e) =>
            setLocation(
              e,
              'Terrapin Springs',
              'terrapinsprings',
              mapInfo.locations.terrapinsprings.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'peppermill' ? 'active' : ''}
          d="M432.659075617732,254.56606349719672L367.63048871740466,254.79891855148438L366.85430601390544,185.57882699328582L357.7108737665112,174.09129293378155L364.7586127144168,174.15338772169778L377.42591443570564,170.53636615527788L381.07397314228,174.3707194785553L403.80060270111426,197.93568427903753L419.5105406202201,201.5992744344686L426.1857118704356,195.7623679369784L426.1857118704356,183.88674448535457L432.3020315740723,176.21803936171807Z"
          id="map_peppermill"
          style={mapInfo.locations.peppermill.style}
          onClick={(e) =>
            setLocation(
              e,
              'Pepper Mill',
              'peppermill',
              mapInfo.locations.peppermill.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'cheddarford' ? 'active' : ''}
          d="M357.7108737665112,174.09129293378155L366.85430601390544,185.57882699328582L367.63048871740466,254.79891855148438L334.76691305066925,254.44187413455782L335.8225215274433,275.6316807031713L291.16096876730444,275.58510970685563L291.33172896207543,265.5723447937156L293.3342803371197,263.3990312866476L299.01593772682827,263.2282709366573L302.67952008743305,260.06144254674416L302.0585739246162,211.64309842562176L311.8850469510944,195.80893900260122L312.071330799954,173.6721531127514Z"
          id="map_cheddarford"
          style={mapInfo.locations.cheddarford.style}
          onClick={(e) =>
            setLocation(
              e,
              'Cheddarford',
              'cheddarford',
              mapInfo.locations.cheddarford.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'easton' ? 'active' : ''}
          d="M253.14353994926205,173.12882370820205L204.74078655819176,173.15987110294822L204.55450270936126,127.535694886644L204.01117481687106,122.84753162604557L214.8311617038562,126.77503268436476L227.6381763118261,126.63531921660785L235.85018931498053,129.35196986551475L240.16576514652115,129.15016153977234L251.1875595364254,125.43999285542742L273.54162139756954,125.43999285542742L264.46028376647155,140.59113920416652L253.29877648994443,152.29601586350145Z"
          id="map_easton"
          style={mapInfo.locations.easton.style}
          onClick={(e) =>
            setLocation(e, 'Easton', 'easton', mapInfo.locations.easton.text)
          }
        ></path>
        <path
          className={selected?.id === 'weston' ? 'active' : ''}
          d="M204.01117481687106,122.84753162604557L204.55450270936126,127.535694886644L204.74078655819176,173.15987110294822L166.89411793492036,172.72520757401333L167.12697274592938,121.5590627891574L171.64435608038912,122.73886558167408L182.09177526968415,121.23306464099852L194.38650929334108,124.12047668833787Z"
          id="map_weston"
          style={mapInfo.locations.weston.style}
          onClick={(e) =>
            setLocation(e, 'Weston', 'weston', mapInfo.locations.weston.text)
          }
        ></path>
        <path
          className={selected?.id === 'southton' ? 'active' : ''}
          d="M204.74078655819176,173.15987110294822L204.18193501167116,236.85355299877693L203.04870826451224,235.48746957302671L194.09155986597762,221.45406503292588L175.77364806309924,200.5902348040134L166.9562125512166,191.10526111108905L166.89411793492036,172.72520757401333Z"
          id="map_southton"
          style={mapInfo.locations.southton.style}
          onClick={(e) =>
            setLocation(
              e,
              'Southton',
              'southton',
              mapInfo.locations.southton.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'oakwillow' ? 'active' : ''}
          d="M203.82489096806967,251.92703948655245L207.2090475553705,252.48589163954392L214.2723101573356,252.33065493089504L212.93727590731578,247.37860371320832L209.4289300874225,243.1561647253166L257.75406520810793,243.1716883986513L272.1134452231054,233.96614935334884L292.9617126394587,228.42419675185172L296.2372036482848,231.5599795287898L302.32247604383156,231.90150041381577L302.67952008743305,260.06144254674416L299.01593772682827,263.2282709366573L293.3342803371197,263.3990312866476L291.33172896207543,265.5723447937156L291.16096876730444,275.58510970685563L254.05943553938414,275.5230150450545L253.88867534461315,260.60477095794806L213.32536725900718,259.7820165049104L207.81447006412782,262.04847214272354Z"
          id="map_oakwillow"
          style={mapInfo.locations.oakwillow.style}
          onClick={(e) =>
            setLocation(
              e,
              'Oak Willow',
              'oakwillow',
              mapInfo.locations.oakwillow.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'eastparton' ? 'active' : ''}
          d="M252.61573571088957,243.1716883986513L253.14353994926205,173.12882370820205L312.071330799954,173.6721531127514L311.8850469510944,195.80893900260122L302.0585739246162,211.64309842562176L302.32247604383156,231.90150041381577L296.2372036482848,231.5599795287898L292.9617126394587,228.42419675185172L272.1134452231054,233.96614935334884L257.75406520810793,243.1716883986513Z"
          id="map_eastparton"
          style={mapInfo.locations.eastparton.style}
          onClick={(e) =>
            setLocation(
              e,
              'East Parton',
              'eastparton',
              mapInfo.locations.eastparton.text
            )
          }
        ></path>
        <path
          className={selected?.id === 'westparton' ? 'active' : ''}
          d="M253.14353994926205,173.12882370820205L252.61573571088957,243.1716883986513L209.4289300874225,243.1561647253166L204.18193501167116,236.85355299877693L204.74078655819176,173.15987110294822Z"
          id="map_westparton"
          style={mapInfo.locations.westparton.style}
          onClick={(e) =>
            setLocation(
              e,
              'West Parton',
              'westparton',
              mapInfo.locations.westparton.text
            )
          }
        ></path>
        <text x="77.56376705903696" y="126.89257545416278">
          Palace Hills
        </text>
        <text x="143.11272822708332" y="101.29220314525485">
          Northwest
        </text>
        <text x="236.82593405011573" y="82.90114684732106">
          Old Town
        </text>
        <text x="316.97280723513853" y="129.5833452703226">
          Safe Town
        </text>
        <text x="145.44960400337808" y="203.19155233022568">
          Southwest
        </text>
        <text x="147.96185716283597" y="156.2328992406851">
          Downtown
        </text>
        <text x="446.5800705603479" y="229.30362759038798">
          Wilson Forest
        </text>
        <text x="389.6135004437581" y="324.170113368631">
          Scenic Vista
        </text>
        <text x="274.6894261128843" y="308.8147565394684">
          Broadview
        </text>
        <text x="346.52945356282544" y="301.1654708038661">
          Chapparal
        </text>
        <text x="396.6468383671396" y="282.2218477079319">
          Terrapin Springs
        </text>
        <text x="397.295612054815" y="219.43395104786325">
          Pepper Mill
        </text>
        <text x="333.04203493699674" y="223.39665684251904">
          Cheddarford
        </text>
        <text x="232.46507505178815" y="148.14913041633014">
          Easton
        </text>
        <text x="185.71921066429627" y="147.84354392950075">
          Weston
        </text>
        <text x="189.24099229052243" y="194.7932120764267">
          Southton
        </text>
        <text x="264.65490147823687" y="253.11882955732526">
          Oak Willow
        </text>
        <text x="279.18183982746666" y="202.83648795023674">
          East Parton
        </text>
        <text x="228.77195820564594" y="208.00133785803428">
          West Parton
        </text>
      </svg>
      <div className="legend">
        <div className="range">
          <span>{mapInfo.legend.start.value}</span>
          <span>{mapInfo.legend.end.value}</span>
        </div>
        <div
          className="gradient"
          style={{
            background: `linear-gradient(
              to right,
              ${mapInfo.legend.start.color},
              ${mapInfo.legend.end.color}
            )`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default CustomMap;
