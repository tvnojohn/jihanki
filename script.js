var moneyListTemplate = [1000, 500, 100, 50, 10]; //お金の種類(大きい順)

//商品名と料金リスト
var commidityList = [{name:'コーラ(CAN)',price:120},{name:'コーラ(PET)',price:150},{name:'緑茶(PET)',price:150}];
var cart={name:'',price:0};//選択中の商品名と料金

var payment = new PaymentMoney(moneyListTemplate);

function PaymentMoney(moneyList){
	/*
	money:自販機に投入した金額，
	list:投入金額の最適なお釣りの返し方，
	type:お金の種類，
	usableMoney:投入可能な紙幣の種類
	*/
	this.money=0;
	this.list= new Array(moneyList.length);
	for(var i=0; i<moneyList.length;i++){
		this.list[i]=0;
	}
	this.type='real';
	this.usableMoney=moneyList;
}

PaymentMoney.prototype.getMoney = function(){
	//投入金額を取得
	return this.money;
};

PaymentMoney.prototype.addMoney = function(coin){
	//投入金額に料金を加算
	this.money += parseInt(coin);
	this.list=makeMoneyList(this.money, this.usableMoney);
};

PaymentMoney.prototype.resetMoney = function(){
	//投入金額をリセット
	this.money=0;
	makeMoneyList(0,this.usableMoney);
}

PaymentMoney.prototype.getType = function(){
	//支払い方法を確認
	return this.type;
}

PaymentMoney.prototype.changeType = function(type){
	//支払い方法を変更
	this.type = type;
}

PaymentMoney.prototype.getList = function(){
	/*
	最適なお釣りの返し方を取得
	ex.1120円->[1,0,1,0,2] 
	*/
	this.list=makeMoneyList(this.money, this.usableMoney);
	return this.list;
};

PaymentMoney.prototype.resetList = function(){
	//最適なお釣りの返し方をリセット
	for(var i=0; i<this.list.length;i++){
		this.list[i]=0;
	}
};

PaymentMoney.prototype.getUsableMoney = function(){
	//投入可能な紙幣を取得
	return this.usableMoney;
};

function makeMoneyList(money, usableMoney){
	//最適なお釣りの返し方を計算
	var balance = money;
	var moneyList = new Array(usableMoney.length);
	for(i=0; i<usableMoney.length; i++){
		if(balance>=usableMoney[i]){
			moneyList[i] = parseInt(balance/usableMoney[i]);
			balance -= usableMoney[i]*moneyList[i];
		}else{
			moneyList[i]=0;
		}
	}
	return moneyList;
}

function init(){
	//初期化
	cart={name:'',price:0};
	payment.changeType('real');
	payment.resetMoney();
	payment.resetList();
}

function addCommidity(name, price){
	//商品リストの追加
	var addData = {name:name,price:price};
	commidityList.push(addData);
}

function getPrice(name){
	//商品名から金額を取得
	for(var i=0;i<commidityList.length;i++){
		if(commidityList[i].name == name){
			return commidityList[i].price;
		}
	}
}

function pushMenuButton(keep,money_list){
	//商品のボタンを押した時の処理
	cart.name=keep.split(':')[0];
	cart.price=keep.split(':')[1].split('円')[0];

	//投入金額，商品の金額，支払い方法から購入可能か判断
	if(payment.getMoney()==0){
		if(payment.getType()=='real'){
			document.getElementById('comment').textContent='お金を先に入れてください！！';
			cart.name='';
			cart.price=0;
		}else{
			
		}
	}
	else if(payment.getMoney()<cart.price){
		document.getElementById('comment').textContent='お金が'+(cart.price-payment.getMoney())+'円不足しています．';
		cart.name='';
		cart.price=0;
	}else if(payment.getMoney()>cart.price){
		var turi=payment.getMoney()-cart.price;
		var purchase = document.createElement('p');
		purchase.textContent=cart.name;
		document.getElementById('purchaseList').appendChild(purchase);
		
		//続けて買い物をするのか確認
		var flg;
		flg = confirm("残高"+turi+"円.続けて買い物をしますか？");
		//買い物を続ける
		if(flg == true){
			payment.addMoney(-cart.price);
			payment.getList = turi;
			document.getElementById('comment').textContent='商品を選んでください';
			document.getElementById('payment').textContent=payment.getMoney()+'円';
			cart.price=0;
		}
		//買い物をやめる
		else{
			var text='お買い上げありがとうございます．お釣りは'+turi+'円です．(' 
			var turiList = makeMoneyList(turi,payment.getUsableMoney());
			for(var i=0;i<payment.getUsableMoney().length;i++){
				if(turiList[i]!=0){
					text+=payment.getUsableMoney()[i]+'円:'+turiList[i]+'枚 ';
				}
			}
			text+=')';
			document.getElementById('comment').textContent=text;
			init();
			document.getElementById('payment').textContent='0円';
		}
	}
}

function throwMoney(money,money_list){
	//お金投入ボタンを押した時の処理
	payment.getType='real';
	//対応する紙幣か判定
	for(var i=0;i<money_list.length;i++){
		if(money.split("円")[0]==money_list[i]){
			payment.addMoney(money.split("円")[0]);
		}else{
			document.getElementById('payment').textContent="そのお金には対応していません．";
		}
	}
	document.getElementById('payment').textContent=payment.getMoney()+"円";
}

function outTuri(){
	//お釣りボタンを押した時の処理
	var turi = payment.getMoney()-cart.price;
	var text = 'お釣りは'+turi+'円です．('
	var turiList = makeMoneyList(turi,payment.getUsableMoney());
	for(var i=0;i<payment.getUsableMoney().length;i++){
		if(turiList[i]!=0){
			text+=payment.getUsableMoney()[i]+'円:'+turiList[i]+'枚 ';
		}
	}
	text+=')';
	document.getElementById('comment').textContent=text;
	init();
	document.getElementById('payment').textContent='0円';
}

function printCommidityList(money_list){
	//商品リストからボタンを作成
	for(var i=0;i<commidityList.length;i++){
		var jihanki = document.getElementById('jihanki');
		if(i>=3 && i%3==0){
			jihanki.appendChild(document.createElement('p'));
		}
		var element = document.createElement('button');
		element.type = 'button';
		element.id = 'kan'+i;
		element.textContent = commidityList[i].name+':'+commidityList[i].price+'円';
		element.onclick = function(){
			pushMenuButton(this.textContent,money_list);
		}
		jihanki.appendChild(element);
	}
}

function printMoney(money_list){
	//投入可能な紙幣リストからボタンを作成
	var jihanki = document.getElementById('moneyList');
	for(var i=0;i<money_list.length;i++){
		var jihanki = document.getElementById('moneyList');
		var element = document.createElement('button');
		element.type = 'button';
		element.textContent = money_list[i]+'円';
		element.onclick = function(){
			throwMoney(this.textContent,money_list);
		}
		jihanki.appendChild(element);
	}
}

window.onload=function(){
	printCommidityList(moneyListTemplate);
	printMoney(moneyListTemplate);
}