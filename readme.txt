本文旨在描述平台涉及的相关功能，使开发人员能够系统由一个整体的认识。
业务如下：
    1、针对平台的用户是每个农村的村支部干部人员，从实际出发会对这些人员进行分部门（或者分组管理：针对一些较小农村不是很明显的）。
       描述：1、新建片区\组
             2、干部维护
             3、角色管理  村委书记、组长...
             4、权限管理
    2、农村中现在的情况是几户为一个组（或者片区），由组长（或者片长）对这些局面进行管理
       描述：1、居民户口
             2、村民维护
             3、村民资产
    3、核心业务△★
       描述：★1、村民须知：农村干部经常会需要向村民广播上级指示、干部开会通知、及相关的村民通知
             ★2、投票管理：
             ★3、商铺管理：
             ★4、广告管理：
             △5、新闻管理：
系统能够达到的效果如下：
    农村干部：
    1、使乡村业务能够电子化流程管理
    2、高效的处理相关业务
    3、达到办事的凭证
    ......
    商业平台：
    1、管理商品：进货、出货、赊账、收账
    2、积分管理：商品兑换、折现等
    3、会员管理：
    4、报表查询：系统可以查看商铺进货、出货、赊账、收账等报表信息；
                 系统可以实时的计算商铺收益、库存等信息
    ......
    ★普通用户：
    普通用户平台为系统的核心功能，理想情况下





























功能描述：
1、系统后台管理系统（分为：机构后台、商户后台、平台后台三部分）
   机构后台：由系统后台管理维护基本信息，机构后台用户无需注册
   商户后台：用户无需注册，根据机构相关人员维护信息获取
             系统中的商户是由系统中存在的普通用户衍生而来，普通用户可以申请为商户在平台开通商铺进行商铺管理功能。
             基本描述：
             1、用户开通商铺会生成商铺账号及商铺子账号
             2、商铺开通后相关联的家庭成员通过管理员授权后对商铺进行管理
             3、商铺管理着还可以根据身份证号（乡民汇账号）查找到系统中存在的用户授权给相应的用户进行管理
             4、商铺可以通过权限控制每个员工（包含授权操作员）对系统的操作范围
             详细描述：
                 针对现实生活中的业务乡民汇将商铺的流程总结如下：做出计划（可以提前做好本次进货进货清单）-进货-售出（批发）-入账(赊账)-利润
   平台后台：




添加token验证方法
安装依赖包
$ npm install oauth20-provider
1、定义你的实体类和控制器方法。（Define your models and decision controller）
