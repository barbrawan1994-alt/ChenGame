import { ULTRA_HEROES } from './ultra';

// A real prop can have multiple collectible attunements; ownership remains per hero.
export const ULTRA_DEVICE_MODELS = [
  ['beta_capsule','贝塔魔棒','Beta Capsule'],
  ['shin_capsule','贝塔魔棒·新','Beta Capsule','Beta Capsule Shin.png'],
  ['ultra_eye','奥特眼镜','Ultra Eye'],
  ['ultra_rings','奥特戒指','Ultra Rings'],
  ['ultra_badge','奥特徽章','Ultra Badge'],
  ['leo_ring','狮子之瞳','Leo Ring'],
  ['beam_flasher','闪光之星','Beam Flasher'],
  ['bright_stick','光明棒','Bright Stick'],
  ['sparklence','神光棒','Sparklence'],
  ['black_sparklence','黑暗神光棒','Sparklence','Black_Spark_Lens_Full.png'],
  ['camilla_sparklence','卡蜜拉神光棒','Sparklence','Camearra Spark Lens.png'],
  ['lieflasher','闪光剑','Lieflasher'],
  ['esplender','蓝宝锥','Esplender'],
  ['agulater','蓝宝镯','Agulater'],
  ['estrellar','埃斯特雷勒','Estrellar'],
  ['nice_dreamer','纳伊斯梦幻之星','Nice Dreamer'],
  ['cosmo_pluck','日月同辉','Cosmo Pluck'],
  ['just_lancer','正义之石','Just Lancer'],
  ['evoltruster','进化信赖者','Evoltruster'],
  ['max_spark','麦克斯火花','Max Spark'],
  ['mebius_brace','梦比优斯气息','Mebius Brace'],
  ['knight_brace','骑士气息','Knight Brace'],
  ['zero_eye','赛罗眼镜','Ultra Zero Eye'],
  ['ginga_spark','银河火花','Ginga Spark'],
  ['victory_lancer','维克特利圣枪','Victory Lancer'],
  ['x_devizer','艾克斯终端','X Devizer'],
  ['orb_ring','欧布圆环','Orb Ring'],
  ['riser','捷德升华器','Riser'],
  ['gyro','罗布回旋闪光','Gyro'],
  ['grigio_gyro','罗布回旋闪光·格丽乔','Gyro','Gyro_(Saki).png'],
  ['taiga_spark','泰迦火花','Taiga Spark'],
  ['z_riser','泽塔升华器','Z Riser'],
  ['guts_sparklence','胜利神光棒','GUTS Sparklence'],
  ['trigger_dark_sparklence','黑暗胜利神光棒','GUTS Sparklence','TriggerBlackSparklence.png'],
  ['d_flasher','奥特D闪光剑','Ultra D Flasher'],
  ['blazar_brace','布莱泽手镯','Blazar Brace'],
  ['arc_ariser','亚刻觉醒器','Arc Ariser'],
  ['omega_slugger','欧米伽头镖','Omega Slugger'],
  ['teo_crystar','TEO晶体','Teo Crystar'],
  ['delta_plasma','三角吊坠','Delta Plasma'],
  ['flash_prism','闪光棱镜','Beta Capsule','Flash Prism HD.png'],
  ['pikari_brush','皮卡力牙刷','Pikari Brush'],
  ['fusion_brace','奥特融合手镯','Ultra Fusion Brace'],
  ['saga_brace','赛迦手镯','Ultimate Bracelet','Saga_Brace.png'],
  ['new_generation_eye','新世代眼镜','New Generation Eye'],
  ['tregear_eye','托雷基亚之眼','Tregear Eye'],
  ['darkevolver','黑暗进化者','Darkevolver'],
  ['dark_spark','黑暗火花','Dark Spark'],
  ['dark_dummy_spark','黑暗虚拟火花','Dark Dummy Spark'],
].map(([id,name,wiki,imageFile])=>({id,name,wiki,imageFile,portrait:`assets/ultra-devices/${id}.webp`}));
const MODELS = Object.fromEntries(ULTRA_DEVICE_MODELS.map(model=>[model.id,model]));
const HERO_MODEL = {
  ultraman:'beta_capsule',shin:'shin_capsule',seven:'ultra_eye',ace:'ultra_rings',taro:'ultra_badge',leo:'leo_ring',
  joneus:'beam_flasher','80':'bright_stick',tiga:'sparklence',dyna:'lieflasher',gaia:'esplender',agul:'agulater',
  neos:'estrellar',nice:'nice_dreamer',cosmos:'cosmo_pluck',justice:'just_lancer',nexus:'evoltruster',
  max:'max_spark',mebius:'mebius_brace',hikari:'knight_brace',zero:'zero_eye',ginga:'ginga_spark',
  victory:'victory_lancer',x:'x_devizer',orb:'orb_ring',geed:'riser',rosso:'gyro',blu:'gyro',grigio:'grigio_gyro',
  taiga:'taiga_spark',titas:'taiga_spark',fuma:'taiga_spark',z:'z_riser',trigger:'guts_sparklence',
  decker:'d_flasher',dinas:'d_flasher',blazar:'blazar_brace',arc:'arc_ariser',omega:'omega_slugger',
  teo:'teo_crystar',great:'delta_plasma',powered:'flash_prism',zearth:'pikari_brush',
  ginga_victory:'fusion_brace',ruebe:'gyro',gruebe:'gyro',reiga:'new_generation_eye',ribut:'guts_sparklence',saga:'saga_brace',
  tiga_dark:'black_sparklence',camilla:'camilla_sparklence',trigger_dark:'trigger_dark_sparklence',
  tregear:'tregear_eye',mephisto:'darkevolver',mephisto_zwei:'darkevolver',ginga_dark:'dark_spark',
  ultraman_dark:'dark_dummy_spark',seven_dark:'dark_dummy_spark',
};
export const ULTRA_DEVICES = ULTRA_HEROES.map(hero=>{
  const replica=!HERO_MODEL[hero.id];
  const model=MODELS[HERO_MODEL[hero.id] || 'ginga_spark'];
  return {
    id:`device_${hero.id}`,heroId:hero.id,modelId:model.id,
    name:replica ? `${model.name}·${hero.name}共鸣` : model.name,
    replica,portrait:model.portrait,
    note:replica ? '银河火花实物造型；本角色的共鸣契约为游戏改编，单独挑战收集。' : `${hero.name}使用的${model.name}，通过该角色的专属试炼收集。`,
  };
});
export const ULTRA_DEVICE_BY_ID = Object.fromEntries(ULTRA_DEVICES.map(device=>[device.id,device]));
export const getUltraDevice = heroId => ULTRA_DEVICE_BY_ID[`device_${heroId}`];
