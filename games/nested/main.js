//================
//Nested by Orteil
//================
//[ http://orteil.deviantart.com , https://twitter.com/Orteil42 , orteil42@gmail.com - more stuff like this at http://orteil.dashnet.org ]
//This is the source-code. Use it wisely. (Better not use it without my permission though.)
//
//I made this when I was bored at work around 2011; I've been progressively adding stuff to it since.
//I am by no means a professional programmer (I do pixel-art and game-design), so please don't judge my code too harshly!
//
//Wikipedia was used extensively for this project. I am now aware of the composition of everything. *Everything*.
//
//(oh yeah, don't read all the code right now, it kind of ruins the surprise of finding things!)


function Choose(arr)
{
	//Returns an element from an array at random.
	return arr[Math.floor(Math.random()*arr.length)];
}

function WeightedChoose(arr,weightChoose)
{
	//Returns an element from an array at random according to a weight.
	//A weight of 2 means the first element will be picked roughly twice as often as the second; a weight of 0.5 means half as often. A weight of 1 gives a flat, even distribution.
	if (weightChoose<=0 || weightChoose==undefined) weightChoose=1;
	return arr[Math.floor(Math.pow(Math.random(),weightChoose)*arr.length)];
	
	//return arr[Math.floor((1-Math.pow(Math.random(),1/weightChoose))*arr.length)];//this would give a different curve

	//previously
	/*
	var iChoose;
	var arrChoose=[];
	if (weightChoose<=0 || weightChoose==undefined) weightChoose=1;
	for (iChoose=0;iChoose<arr.length;iChoose++)
	{
		if (Math.round(Math.random()*(iChoose*weightChoose))==0) arrChoose.push(arr[iChoose]);
	}
	return Choose(arrChoose);
	*/
}


function Rand(min,max)
{
	//Return a number between min and max, included.
	return parseFloat(Math.floor(Math.random()*(max-min+1)))+parseFloat(min);
}


var Things=[];
var ThingsN=0;
function Thing(name,contains,namegen)
{
	this.name=name;
	this.contains=contains;
	this.namegen=namegen;
	if (this.namegen==undefined) this.namegen=this.name;

	Things[name]=this;
	ThingsN++;
}

function CheckMissingThings()
{
	var allContents=[];
	var allMissing=[];
	for (var i in Things)
	{
		var thisThing=Things[i];
		for (var i2 in thisThing.contains)
		{
			thisContent=thisThing.contains[i2];
			if (typeof(thisContent)!="string")
			{
				for (var i3 in thisContent) {allContents.push(thisContent[i3]);}
			}
			else allContents.push(thisContent);
		}
	}
	for (var i in allContents)
	{
		var thisContent=allContents[i];
		if (thisContent.charAt(0)==".") thisContent=thisContent.substring(1);
		thisContent=thisContent.split(",");
		thisContent=thisContent[0];
		if (!Things[thisContent] && thisContent!="") allMissing.push(thisContent);
	}
//	allMissing=allMissing.filter(function(elem,pos) {return allMissing.indexOf(elem)==pos;});//remove duplicates

	var str="Things that are linked to, but don't exist :\n";
	for (var i in allMissing)
	{
		str+=allMissing[i]+"\n";
	}
	alert(str);
}

function CleanThings()
{
	for (var iT in Things)
	{
		thisT=Things[iT];

		toConcat=[];
		for (var i in thisT.contains)
		{
			if (typeof(thisT.contains[i])=="string")
			{
				if (thisT.contains[i].charAt(0)==".")
				{
					if (Things[thisT.contains[i].substring(1)]!=undefined)
					{
						toConcat=toConcat.concat(Things[thisT.contains[i].substring(1)].contains);
					}
					thisT.contains[i]="";
				}
			}
		}

		if (toConcat.length>0)
		{
			for (var i in toConcat)
			{
				thisT.contains.push(toConcat[i]);
			}
		}

		newContains=[];
		for (var i in thisT.contains)
		{
			if (thisT.contains[i]!="") newContains.push(thisT.contains[i]);
		}
		thisT.contains=newContains;

	}
}




var iN=0;
var Instances=[];
function Instance(what)
{
	this.name="thing";
	this.type=Things[what];
	this.parent=0;
	this.children=[];
	this.n=iN;
	this.display=0;
	this.grown=false;
	iN++;
	Instances.push(this);

	return this;
}

function Title(what)
{
	//Changes a string like "the cat is on the table" to "the Cat Is on the Table"
	what=what.split(" ");
	var toReturn="";
	for (var i in what)
	{
		if (what[i]!="of" && what[i]!="in" && what[i]!="on" && what[i]!="and" && what[i]!="the" && what[i]!="an" && what[i]!="a" && what[i]!="with" && what[i]!="to" && what[i]!="for") what[i]=what[i].substring(0,1).toUpperCase()+what[i].substring(1);
		toReturn+=" "+what[i];
	}
	return toReturn.substring(1);
}

Instance.prototype.Name=function()
{
	this.name=this.type.namegen;

	if (typeof(this.name)!="string")
	{
		var str="";
		if (typeof(this.name[0])=="string") str+=Choose(this.name);
		else
		{
			for (var i in this.name)
			{
				str+=Choose(this.name[i]);
			}
		}
		this.name=str;
	}

	nameParts=this.name.split("|");
	this.name=nameParts[0];

	if (this.name=="*PERSON*" || this.name=="*MAN*" || this.name=="*WOMAN*")
	{
		//Generates a first name + last name, compiled from the 100 most popular names in the USA. Yes, every person in the universe is an American.
		if (this.name=="*PERSON*") var gender=Choose([0,1]);
		else if (this.name=="*MAN*") var gender=1;
		else if (this.name=="*WOMAN*") var gender=0;
		var str="";
		//http://names.mongabay.com/male_names.htm
		if (gender==0) str+=WeightedChoose(["Mary","Patricia","Linda","Barbara","Elizabeth","Jennifer","Maria","Susan","Margaret","Dorothy","Lisa","Nancy","Karen","Betty","Helen","Sandra","Donna","Carol","Ruth","Sharon","Michelle","Laura","Sarah","Kimberly","Deborah","Jessica","Shirley","Cynthia","Angela","Melissa","Brenda","Amy","Anna","Rebecca","Virginia","Kathleen","Pamela","Martha","Debra","Amanda","Stephanie","Carolyn","Christine","Marie","Janet","Catherine","Frances","Ann","Joyce","Diane","Alice","Julie","Heather","Teresa","Doris","Gloria","Evelyn","Jean","Cheryl","Mildred","Katherine","Joan","Ashley","Judith","Rose","Janice","Kelly","Nicole","Judy","Christina","Kathy","Theresa","Beverly","Denise","Tammy","Irene","Jane","Lori","Rachel","Marilyn","Andrea","Kathryn","Louise","Sara","Anne","Jacqueline","Wanda","Bonnie","Julia","Ruby","Lois","Tina","Phyllis","Norma","Paula","Diana","Annie","Lillian","Emily","Robin"],1.2);
		else if (gender==1) str+=WeightedChoose(["James","John","Robert","Michael","William","David","Richard","Charles","Joseph","Thomas","Christopher","Daniel","Paul","Mark","Donald","George","Kenneth","Steven","Edward","Brian","Ronald","Anthony","Kevin","Jason","Matthew","Gary","Timothy","Jose","Larry","Jeffrey","Frank","Scott","Eric","Stephen","Andrew","Raymond","Gregory","Joshua","Jerry","Dennis","Walter","Patrick","Peter","Harold","Douglas","Henry","Carl","Arthur","Ryan","Roger","Joe","Juan","Jack","Albert","Jonathan","Justin","Terry","Gerald","Keith","Samuel","Willie","Ralph","Lawrence","Nicholas","Roy","Benjamin","Bruce","Brandon","Adam","Harry","Fred","Wayne","Billy","Steve","Louis","Jeremy","Aaron","Randy","Howard","Eugene","Carlos","Russell","Bobby","Victor","Martin","Ernest","Phillip","Todd","Jesse","Craig","Alan","Shawn","Clarence","Sean","Philip","Chris","Johnny","Earl","Jimmy","Antonio"],1.2);
		str+=" ";
		if (Rand(0,30)==1) str+="Mc";
		str+=WeightedChoose(["Smith","Johnson","Williams","Brown","Jones","Miller","Davis","Garcia","Rodriguez","Wilson","Martinez","Anderson","Taylor","Thomas","Hernandez","Moore","Martin","Jackson","Thompson","White","Lopez","Lee","Gonzalez","Harris","Clark","Lewis","Robinson","Walker","Perez","Hall","Young","Allen","Sanchez","Wright","King","Scott","Green","Baker","Adams","Nelson","Hill","Ramirez","Campbell","Mitchell","Roberts","Carter","Phillips","Evans","Turner","Torres","Parker","Collins","Edwards","Stewart","Flores","Morris","Nguyen","Murphy","Rivera","Cook","Rogers","Morgan","Peterson","Cooper","Reed","Bailey","Bell","Gomez","Kelly","Howard","Ward","Cox","Diaz","Richardson","Wood","Watson","Brooks","Bennett","Gray","James","Reyes","Cruz","Hughes","Price","Myers","Long","Foster","Sanders","Ross","Morales","Powell","Sullivan","Russell","Ortiz","Jenkins","Gutierrez","Perry","Butler","Barnes","Fisher","Henderson","Coleman","Simmons","Patterson","Jordan","Reynolds","Hamilton","Graham","Kim","Gonzales","Alexander","Ramos","Wallace","Griffin","West","Cole","Hayes","Chavez","Gibson","Bryant","Ellis","Stevens","Murray","Ford","Marshall","Owens","Mcdonald","Harrison","Ruiz","Kennedy","Wells","Alvarez","Woods","Mendoza","Castillo","Olson","Webb","Washington","Tucker","Freeman","Burns","Henry","Vasquez","Snyder","Simpson","Crawford","Jimenez","Porter","Mason","Shaw","Gordon","Wagner","Hunter","Romero","Hicks","Dixon","Hunt","Palmer","Robertson","Black","Holmes","Stone","Meyer","Boyd","Mills","Warren","Fox","Rose","Rice","Moreno","Schmidt","Patel","Ferguson","Nichols","Herrera","Medina","Ryan","Fernandez","Weaver","Daniels","Stephens","Gardner","Payne","Kelley","Dunn","Pierce","Arnold","Tran","Spencer","Peters","Hawkins","Grant","Hansen","Castro","Hoffman","Hart","Elliott","Cunningham","Knight","Bradley"],2);
		if (gender==1 && Rand(0,2000)==1) str=Choose(["Elvis Presley","Gabe Newell"]);//4chan made me do it
		this.name=str;
	}
	else if (this.name=="*MEDIEVAL PERSON*" || this.name=="*MEDIEVAL MAN*" || this.name=="*MEDIEVAL WOMAN*")
	{
		//Generates a medieval first name + last name, mostly taken from http://www.infernaldreams.com/names/Europe/Medieval/England.htm
		if (this.name=="*MEDIEVAL PERSON*") var gender=Choose([0,1]);
		else if (this.name=="*MEDIEVAL MAN*") var gender=1;
		else if (this.name=="*MEDIEVAL WOMAN*") var gender=0;
		var str="";
		if (gender==0) str+=Choose(["Millicent","Alinor","Eleanor","Agnes","Alice","Avice","Beatrice","Cecily","Emma","Isabella","Joan","Juliana","Margery","Matilda","Roh","Morgan","Elizabeth","Kethleen"]);
		else if (gender==1) str+=Choose(["Adam","Geoffrey","Gilbert","Henry","Hugh","John","Nicholas","Peter","Ralf","Richard","Robert","Roger","Simon","Thomas","Walter","William","Robin","Albin","Bayard","Erwin"]);
		str+=" ";
		str+=Choose(["Strong","Tall","Grand","Bold","Big","Small","Fine","Good","Glad","Green","Blue","Red","Black","White","Pale","Gray","Gold","Silver","Dark","Light","Brave","Sly"]);
		str+=Choose(["ington","son","house","door","castle","forest","tree","leaf","wind","rain","snow","rock","stone","river","sea","ship","smith","craft","cook","worth","might","wolf","bear","sheep","pig","fox","hunt","dragon"]);
		this.name=str;
	}
	else if (this.name=="*ANCIENT PERSON*" || this.name=="*ANCIENT MAN*" || this.name=="*ANCIENT WOMAN*")
	{
		//Generates a primitive name
		if (this.name=="*ANCIENT PERSON*") var gender=Choose([0,1]);
		else if (this.name=="*ANCIENT MAN*") var gender=1;
		else if (this.name=="*ANCIENT WOMAN*") var gender=0;
		var str="";
		str=Choose(["Passing","Walking","Running","Sitting","Kneeling","Timid","Dreaming","Swift","Deadly","Wise","Old","Young","Ugly","Bright","Broken","Fine","Soulful","Loud","Mad","Crazed","Unending","Lone","Sure","Steady","Hungry","Crafty","Thirsty","Rising","Falling","Huge","Magnificent","Deep","Aching","Mourning","Sweet","Kind","Comforting","Misshapen","Smiling","Sneaking","Trusted","Shifty","Furious","Lustful"]);
		str+=" ";
		str+=Choose(["Thought","Eyes","Legs","Hands","Nose","Sorrow","Scream","Whisper","Rage","Stream","River","Sky","Light","Spark","Moon","Sun","Star","Forest","Cloud","Tree","Rock","Beast","Rabbit","Wolf","Auroch","Mammoth","Lion","Spear","Flame","Cave","Ocean","Snail","Slug","Bear","Shark","Toad","Day","Night","Friend","Snake","Ears","Spirit","Track","Pebble","Boulder","Mountain","Volcano","Storm","Rain","Snow"]);
		if (gender==1 && Rand(0,250)==1) str="Dave";
		this.name=str;
	}
	else if (this.name=="*FUTURE PERSON*" || this.name=="*FUTURE MAN*" || this.name=="*FUTURE WOMAN*")
	{
		//Generates a futuristic first name + last name
		if (this.name=="*FUTURE PERSON*") var gender=Choose([0,1]);
		else if (this.name=="*FUTURE MAN*") var gender=1;
		else if (this.name=="*FUTURE WOMAN*") var gender=0;
		var str="";
		if (gender==0) str+=Choose(["Alice","Trillian","Zeria","Zinda","Myriad","Shosset","Tary","Wayt","Cassidy","Millanda","Replika","Simia","Mirrix","Bariona","Sossis","Kroassent","Five","Seven","Fourteen"]);
		else if (gender==1) str+=Choose(["Bob","Zaphod","Zorvax","Zerebius","Borbon","Bradbury","Isaac","Werber","Omni","Robion","Shossur","Alistor","Clonos","Sorbel","Boodin","Bagget","Three","Twelve","Twenty"]);
		str+=" ";
		str+=Choose(["Zar","Star","Solar","Jaro","Mera","Gar","Dar","Bar","Mar","Mor","Dor","Kar","Kra","Sbur","Bostro","Astro","Cosmo","Poly","Beeble","Pro","Nano","Shimmer","Glimmer","Wander","Lea","Magna"]);
		str+=Choose(["bion","bius","micus","bicus","dion","dius","billion","million","bistor","bostrud","wund","brox","biotis","saurus","boticus","meld","sweep","block","dine","zine","nople","neon","ba","zor","zar","klor"]);
		this.name=str;
	}
	else if (this.name=="*MEMORY*")	//Memories and thoughts are a little tricky because they have to be gender-neutral (you can't go up levels to figure out if the person is male or female).
	{
		var str="";
		str+=WeightedChoose([
		Choose(["Biking","Hiking","Swimming","Flying kites","Playing","Playing baseball","Stargazing","Playing soccer","Playing basketball","Playing chess","Playing checkers","Playing video-games","Watching TV","Cooking"])+" with my "+Choose(["mother","father","parents","grand-father","grand-mother","grand-parents","uncle","aunt","cousin","sister","brother"])+Choose([""," when I was "+Choose(["a child","young",Rand(7,21)])])+".",
		"The day I "+Choose(["learned how to "+Choose(["drive","cook","love","kiss","read","forgive","make friends","speak another language","play "+Choose(["piano","drums","guitar","saxophone","cards"])]),Choose(["graduated high school","graduated college","got my license"]),Choose(["got promoted as ","got a job as ","finally became "])+Choose(["a cook","a reporter","a game designer","a lawyer","a doctor","a veterinarian","a biologist","a soldier","a physicist","a scientist","a geologist","a shopkeeper","a teacher","a historian","an archeologist","a musician","an artist","an athlete","a dancer"])])+".",
		Choose(["Kissing","Cuddling with","Watching movies with","Staying up late with","Sharing secrets with","Sharing childhood memories with","Feeling close to","Laying my arm around"])+" "+Choose(["that one person","my best friend","my love interest","my crush"])+" in "+Choose(["middle school","high school","college"])+".",
		"The day I "+Choose(["got married","had my daughter","had my son","lost my father","lost my mother","went on a trip with "+Choose(["my partner","my family","my friends"]),"learned "+Choose(["I","my son","my daughter","my sister","my brother","my father","my mother"])+" was ill","learned we were at war","learned the war was over","broke my "+Choose(["leg","ankle","elbow","knee","nose"]),"broke up with my partner","lost my "+WeightedChoose(["dog","cat","bunny","hamster","gerbil","bird","goldfish","ferret","rat","iguana","pet spider"],1.5)])+".",
		"That one unforgettable "+Choose(["book","movie","video game","trip","kiss","person I met","party"])+"."
		],1.5);
		this.name=str;
	}
	else if (this.name=="*SADTHOUGHT*")
	{
		var str="";
		str+=WeightedChoose([
		Choose(["This place is crowded.","I don't want to live here my whole life.","I don't want to spend the rest of my life here.","I want to meet different people.","I'm so alone.","I don't want to be alone.","When did I get so lonely?","I'm scared.","I feel so insignificant.","Does it matter, really?","This is absurd.","I hate this place.","I hate the people here.","Nobody understands me.","I wish the voices would stop.","I'm in debt.","I shouldn't spend so much.","I don't really like my friends.","I regret doing that thing I did.","I hope they never find out.","What if I get caught?","This is killing me.","What will happen to me when I die?","This is all sick.","What's the point?","I secretly know the meaning of life but I won't tell anyone.","I know why we're here.","What if this was real?","Some people need to check their privilege...","This isn't what I wanted.","I... I just want "+Choose(["a friend","friends","someone to hug","a family","someone who understands me","to have kids"])+".","Is this how it's going to end?","Oh, that's going on my blog."]),
		Choose(["I'm too lazy.","I don't want to get fired.","I'm worried.","I don't deserve this.","Why am I doing this to myself?","This isn't like me.","If only I was "+Choose(["a pirate","a dolphin","an unicorn","a panda","a cyborg","a robot","a superhero","invisible"])+".","Hold me. I'm scared.","This is my only shot at this.","This was my only shot at this, and I blew it.","I won't make the same mistake twice.","If I must.","As you wish.","Where are my parents now?","I hate myself sometimes.","I'm "+Choose(["worthless","terrible","just a bad person","just not a good person","so awful","so alone. I need help","never going to amount to anything","no good. My mom was right","not that bad, I guess","a faker","so bad at this","too nice for my own good"])+".","What a waste.","I wish I was a better person.","I should learn a new "+Choose(["skill","language"])+".","I'm terrified of death.","I don't want to get older.","I wish I didn't waste my youth.","I regret so much.","I shouldn't have said no.","I should call "+Choose(["her","him"])+" and say sorry.","I should call my parents.","I miss "+Choose(["him","her","them"])+Choose([". So much","",""])+".","I "+Choose(["wish I was","should be","want to be"])+" "+Choose(["more generous","nicer","more popular","more interesting","more romantic"])+".","I don't suck at "+Choose(["singing","painting","dancing","writing","video-games","maths"])+". People just think I do.","Nobody must know about "+Choose(["my balding hair","my parents","this","me","my drinking problem","my health problems","what I do in the shower","what I did","what I'm about to do","what I'm doing","the movies I watch","the books I read","the websites I go on"])+".","I am secretly "+Choose(["a regular human being","perfectly normal","perfectly ordinary","spying on you right now","a wizard","the smartest person in the world","the wisest person in the world","the most important person in the world","a spider","a robot","a midget","a very ancient ghost","an extra-terrestrial","a tree","a flower","a shark","a bear","my own cousin","an astral monstrosity","a secret"])+".","I'm tired. I've been doing this all day.","Don't listen to what they say. It's just not true.","Too many rumors going on.","It's not what it looks like, I swear!","Uh... I can explain.","Well, I'm glad nobody can read my mind.","My friends aren't real.","I'm the only real person here."]),
		Choose(["I need","I want","I might need","I should get","What I want is","What I need right now is","I'll just get"])+" "+Choose(["some new shoes","a new TV","a new computer","another car","a bigger house","a better job","a lover","more pets","a makeover","a good movie","a nice dinner in town"])+".",
		Choose(["My "+Choose(["butt","nose","foot","ear","forehead","back"])+" is itchy.","My "+Choose(["head","leg","arm","belly","back","shoulder"])+" "+Choose(["feels weird","feels icky","hurts","feels strange"])+".","I should see a doctor for my "+Choose(["eyes","brain","head","chest","legs","back"])+"."]),
		Choose(["This "+Choose(["marriage","relationship"])+" "+Choose(["is a failure","is a disaster","was a mistake","isn't working"]),"I regret getting married","I want a divorce","This isn't why I got married"])+".",
		Choose([Choose(["I just can't stand the taste of","I am not going to finish","I paid way too much for","I don't really like"])+" "+Choose(["this hamburger","this steak","this salad","this pasta","this sandwich","this pizza","this meal","this beer","this soda"])+".",Choose(["I hate that show","That show is revolting","I hate that show, but I'm going to watch it anyway","My parents used to watch that show","There's nothing on TV","That's a stupid movie","I've seen that movie already"])+".",Choose(["Wait, ","Hold on. ","Ugh. ","Ugh, I told them ",""])+"I'm allergic to "+Choose(["shrimp","soy","pineapple"])+"."]),
		Choose(["This will not stand.","Dammit I'm mad.","Yes, I am mad.","I won't let this happen.","No. Never. Not if I have a word in it.","Over my dead body.","Do they have any idea how angry I am?","I am absolutely furious.","This upsets me.","Well, I am upset.","On we march.","This is not over.","I can see them, beyond the stars.","I can sense them. They're coming.","Something is coming this way.","Something is about to go horribly wrong.","It was written.","It is coming.","We must fight on.","I've seen things.","Oh no. I'm thinking weird stuff again.","Do you really think I can't see you?","I don't look at the world the way I used to.","Can't you hear them?","It's always there.","It won't go away.","There are things that I just can't explain.","Who where?","They don't think it is like this. But it is.","The world looks too intense for me.","I never asked for this.","No! I don't want that!","What if we're all living in a giant computer simulation?","This place would look good on fire!","This is the end, isn't it?","The end."])
		],1.4);
		this.name=str;
	}
	else if (this.name=="*HAPPYTHOUGHT*")
	{
		var str="";
		str+=WeightedChoose([
		Choose(["What a nice day!","It's sunny today.","It's a sunny day out.","It's such a nice day.","It's such a great day to be alive!","This is a happy kind of day.","I feel great.","Ooh, I'm feeling fine.","I'm feeling awesome.","Hey, this is great!","I'm so glad I came here.","I regret nothing!","Regrets are pointless.","I have no regrets.","This is what I wanted!","Everything's going just fine.","I can't wait!","Things are going smoothly.","I'm just happy to be here.","Well, this is "+Choose(["unexpected","awkward","fun","just funny","strange","interesting","odd","peculiar","weird"])+".","I know the meaning of life!","I didn't expect this!","I'm glad someone understands me.","I'm glad someone likes me for who I am.","I love my friends!","Life is good!","I could picture myself spending the rest of my life here.","I should meet new friends!","I feel loved.","I feel almighty!","I matter.","This place is nice.","Everybody's great in some way!","I hope "+Choose(["they","she","he"])+"'ll like me!","I wonder what happens next!","It's all going to be alright.","It'll all be alright in the end. I just know it.","This is actually okay.","I love the whole world!","The world is a big place!","The world is amazing!","So it has come to this.","Well this is an interesting development.","Let's see what happens next.","Oh hey. I found me.","I NEED to blog about this."]),
		Choose(["I should take a self-help course!","I'm doing alright.","My job is pretty fulfilling.","I don't really worry.","Worrying is pointless!","This is cooler than I expected!","Haha, this is just like me.","Wouldn't it be awesome if I was "+Choose(["a pirate","a dolphin","an unicorn","a panda","a cyborg","a robot","a superhero","invisible"])+"?","I'm pretty self-confident.","I'm a pretty big deal.","I'm pretty extreme.",Choose(["You want a piece of this?","I'm all business, all the time.","I vibrate through walls.","This is going to be gay as hell.","We're making this happen!"]),"I mean, wow.","Yep. Just a regular human person. Nothing to see here.","I want to become even better!","I should learn a new "+Choose(["skill","language"])+"!","I hope I'll become a nice old person.","I kinda miss my youth!","I should call "+Choose(["her","him"])+" and say \"I love you\"!","Maybe I should call my parents?","You can always better yourself.","Do I really suck at "+Choose(["singing","painting","dancing","writing","video-games","maths"])+"?","I'm secretly "+Choose(["super-hardcore","perfectly normal","perfectly ordinary","peeking over your shoulder right now","a wizard","the smartest person in the world","the wisest person in the world","the most important person in the world","a spider","a robot","a midget","a very ancient ghost","an extra-terrestrial","a tree","a flower","a shark","a bear","my own cousin","an astral monstrosity","a secret"])+"!","H-here I go!","This place would look good on fire!","I don't worry, because I know nothing matters in the end.","Well, I'm glad nobody can read my mind."]),
		Choose(["Hmm! I should get","I know what would be awesome...","Time for","I need","You know what? I need","Know what I need? I'll tell you - "])+" "+Choose(["some new shoes","a new TV","a new computer","a new car","a bigger house","a cooler job","a lover","more pets","a makeover","a good movie","a nice dinner in town"])+"!",
		Choose(["This is the best relationship ever.","I love being married!","Marriage isn't as bad as they make it out to be!","This relationship is awesome!","I love my family.","I love doing stuff with my family."]),
		Choose([Choose(["I really, really like","I can't get enough of","I'm going to get more of","I wonder what they put in"])+" "+Choose(["this hamburger","this steak","this salad","this pasta","this sandwich","this pizza","this meal","this beer","this soda"])+".",Choose(["Haha, I love that show!","That show is confusing!","That show is hilarious.","That's a silly show, but there's nothing on TV anyway.","Oooh, my parents used to watch that show!","There's nothing on TV!","That movie's plot is hilariously bad.","I've never seen that movie before!"])])
		],1.4);
		this.name=str;
	}
	else if (this.name=="*MEDIEVAL MEMORY*")
	{
		var str="";
		str+=WeightedChoose([
		Choose(["Tending the fields","Tending the animals","Harvesting the crops","Learning to cook","Learning magic tricks","Learning alchemy","Learning how to yield a sword","Learning how to defend myself","Learning how to shoot a bow","Learning about the gods above","Learning about the spirits that inhabit every thing","Learning proper manners","Looking at the skies","Swimming in the rivers","Exploring the woods","Wandering the wild expanses","Getting lost in the woods","Travelling to the city","Running from wild beasts","Hunting wild beasts","Taking part in the great hunt","Tracking beasts","Sparring"])+" with my "+Choose(["mother","father","parents","grand-father","grand-mother","grand-parents","uncle","aunt","cousin","sister","brother","caretaker","master"])+Choose([""," when I was "+Choose(["a child","young",Rand(6,16)])])+".",
		"The day I "+Choose(["found my calling","mastered "+Choose(["the art of blacksmithing","the art of swordfighting","the arcane arts","the arts of writing","the art of war","all of the arts and sciences"]),Choose(["finished my training","finished my education","was accepted into the guild"]),Choose(["found task as ","was called to become ","finally became "])+Choose(["a cook","a squire","an engineer","a footsoldier","a bard","a peasant","a blacksmith","a lumberjack","a monk"])])+".",
		Choose(["The sweetness of the lips of","The fond affection I felt for","Conversing late into the night with","The kinship I felt for"])+" "+Choose(["that one person","my companion","my love interest","the person I courted"])+" "+Choose(["when I was still a child","when I was young","when I was in training"])+".",
		"The day I "+Choose(["wed my partner","became a parent","lost my father","lost my mother","explored the world with "+Choose(["my partner","my family","my companions","my master"]),"learned "+Choose(["I","my son","my daughter","my sister","my brother","my father","my mother"])+" was ill","fell victim to disease","learned we were at war","learned the war was over","took part in the war","helped strike down a dragon","had to leave our town due to contagious diseases","was forced to move to a new town","was forced to become a beggar","visited our castle","saw a display of magic at the castle","broke my "+Choose(["leg","ankle","elbow","knee","nose"]),"lost "+Choose(["my dog","my cat","my cattle","a valuable trinket","a magic artifact","my way in the forest"])])+"."
		],1.5);
		this.name=str;
	}
	else if (this.name=="*MEDIEVAL THOUGHT*")
	{
		var str="";
		str+=WeightedChoose([
		Choose(["Today was a fine day.","Many things happened on this day.","What an eventful week this has been.","It's been a good year so far.","So much to do, so little time.","I was born too soon.","I'm still young. I'll manage.","I would still be "+Choose(["an adventurer","a bandit","a traveller","a travelling merchant","a hunter","a courrier"])+" if not for that "+Choose(["witch","ambush years ago","dragon","new king","stupid accident","unfortunate wound"])+".","What a surprising world we live in.","Hopefully next year's crops will be fruitful.","What hides yonder?","What lies yonder, I wonder.","So many things out of my comprehension.","I want to see more of this world.","I am sworn to carry this burden.","I'll "+Choose(["ready my spells","grab my sword","grab my axe","grab my shield","pack my things"])+" and go on an adventure.","I will "+Choose(["compose a sonnet","tell the tale","write a saga","compose a song"])+" of "+Choose(["witches","princesses","adventure","fate","distant kingdoms","unicorns","knights","bards","swords","love"])+" and "+Choose(["wizards","princes","dragons","magic","paladins","warlocks","dungeons","destruction","monsters","friendship"])+"!","I want to travel and see "+Choose(["the unicorns","the dinosaurs","a dragon","the steam monsters","the goblin kingdoms","the dwarves in the mountains","pixies","fairies","catpeople","sharkpeople","dogpeople","the troll pits","the wizard kingdom","the footfaces","the cephalites","the gembabies"])+"!","What strange and terrifying creatures could live in the distant lands?","I've heard so many stories about the things that live in the farlands.","Thank our star, I feel fine now.",Choose(["She","He","They"])+" "+Choose(["will regret it","will regret saying that","will regret doing that","must pay, somehow","will get what's coming","will get what is deserved","will see how right I was","will not hold me back any longer","will regret laughing at me"])+".",Choose(["Our star will guide us throughout.","I trust our star to guide us in the right direction.","I trust our star to point us to the right choices."]),"I need to "+Choose(["find","see","consult"])+" "+Choose(["a physician","a witch","a wizard","an apothecary","an exorcist","a priest"])+".",Choose(["What is that smoke on the horizon?","That new moon keeps getting bigger.","Will the court wizards keep us safe?","The Entities are due soon.","All of our cattle is getting sick. What's happening?","I don't want to take part in another sacrifice.","Let's hope that sacrifice was worth it.","I hate those dark rituals.","I hope the liches will leave us alone this year.","I keep finding these weird stones.","Some must fight, so that all may be free."])])
		],1.1);
		this.name=str;
	}
	else if (this.name=="*ANCIENT MEMORY*")
	{
		var str="";
		str+=WeightedChoose([
		Choose(["Scouting for wild beasts","Tending the fire","Chopping wood","Learning the secrets of fire","Learning the shamanic ways","Scouting the wilderness for resources","Searching for fresh water","Taking part in the great hunt",Choose(["Hunting wild","Tracking","Running from wild","Ambushing","Making pelts from","Skinning","Slicing the meat off"])+" "+Choose(["mammoths","saber-toothed cats","mountain lions","wooly rhinoceroses","wolves","aurochs","rabbits"]),"Bringing our catch back to the settlement","Harvesting wild berries","Harvesting wild grain","Fetching water","Learning how to throw a spear","Learning how to use a harpoon","Learning how to sculpt the stone","Learning about the spirits","Hiding from wild beasts","Staring at birds in the sky","Looking at the stars at night","Looking at the skies","Swimming in the rivers","Exploring the woods","Wandering the wild lands","Getting lost in the woods"])+" with my "+Choose(["mother","father","family","tribe","sister","brother"])+Choose([""," when I was "+Choose(["a child","younger"])])+".",
		"The day I "+Choose(["followed the path of my ancestors","mastered "+Choose(["the art of stonecarving","the art of woodcarving","the art of making fire","the shamanic way","the art of painting images on cave walls","the techniques of spear-throwing","hunting"])])+".",
		Choose(["The affection I felt for","Talking late into the night with","The kinship I felt for"])+" "+Choose(["my mate","my friend","my friends","my tribe"])+" "+Choose(["when I was still a child","when I was young","when I was in training","when I was on that great hunt"])+".",
		"The day I "+Choose(["had my son","had my daughter","lost my father","lost my mother","became the last of my tribe and had to find a new tribe to take me in","became accepted into a new tribe","explored the wilderness with "+Choose(["my mate","my friend","my tribe"]),"realized "+Choose(["I","my son","my daughter","my father","my mother"])+" was sick","fell sick","encountered members of another tribe","had a skirmish with another tribe","helped strike down a wild beast","almost starved","found a new way to cut rocks","broke my "+Choose(["leg","ankle","elbow","knee","nose"]),"got lost in the forest"])+"."
		],1.5);
		this.name=str;
	}
	else if (this.name=="*ANCIENT THOUGHT*")
	{
		var str="";
		str+=WeightedChoose([
		Choose(["Today. Nice day.","Many things, today.","Good year so far. Not many dead children.","I sure hope wolves don't eat my baby again.","Family comes back from hunt soon. Right?","Busy. Always busy.","I was born too soon.","I am young still. So much to learn!","I must stay home because of wound. Total baloney.","Spoiled meat and no fire is utter baloney.","Beasts are getting scarce. Absolute baloney.","The spirits must hate me. Only explanation.","Oh, my aching head.","No. I don't want.","This displeases me.","Sun setting soon. Must ready the fire.","We mustn't do that mistake with the fire again.","We live in surprising world.","Many more hunts to come.","What lies beyond hills?","Does sun sleep behind mountains?","I do not comprehend many things. But I will try.","This world. I want to see more of it.","I must "+Choose(["sharpen spears for next hunt","prepare for next hunt","tend to my children now","get ready for big hunt","get tools ready for tomorrow"])+".","I am curious. About distant things.","I don't feel so sick anymore.","I won't eat raw rabbit again.",Choose(["She","He","They"])+" "+Choose(["will regret it","will regret saying that","will regret doing that","must pay","will get what's coming","will get what is deserved","will see how right I was","will not hold me back any longer","will regret laughing at me"])+".",Choose(["Our shaman will guide us throughout.","I trust our shaman to guide us in the right direction.","I trust our shaman to point us to the right choices.","Where has our shaman gone now?","I must consult our shaman."]),Choose(["What is smoke on horizon?","Moon... getting bigger.","Will our shaman keep us safe?","The Old Things come back soon.","All the beasts, they are getting sick. What is happening?","I do not want to take part in another sacrifice.","Let us hope sacrifice was worth it.","I do not like those dark rituals.","I hope the Old Things will leave us alone this year.","I keep finding these strange stones.","I saw the lights. But nobody believes me.","Oh boy. Shamanic ritual soon. We eat funny mushrooms.","Have ritual. Smoke plants. All get naked. Good times.","I shake fist at you, spirits!"]),"I have great idea! "+Choose(["Round stone. Rolls fast, make transportation!","Shiny rocks. Melt on fire, make weapons!","Hungry wolves. Make friends, hunt for us!","Wild seeds. Plant in ground, harvest later!","Babies. Eat the babies. Free meat!","Tickle auroch udder, drink free udderjuice!","Smash rocks found on the beach. Eat insides."])])
		],1.1);
		this.name=str;
	}
	else if (this.name=="*FUTURE MEMORY*")
	{
		var str="";
		str+=WeightedChoose([
		Choose(["Spraying the clearpath","Clearing the tendrils","Shedding our nanomolts","Ionizing the biomass","Collecting stardust","Equipping my first synchotron","Brainalyzing each other","Learning how to use a transponder","Reversing polarities","Stepping into that astrodeck","My first time in microgravity","Browsing the stars","Synthesizing new organisms","That night we spent synthesizing every exotic food we could think of","Synthesizing new outfits for hours","Getting our lungs removed","Riding the claytide","Searching the moon for clams","Learning old-timey cooking","Visualizing old videoverses","Experiencing that exciting new videoverse","Losing our headsets and getting lost","Earning my lifekey","Inadvertantly spawning starkids"])+" with my "+Choose(["biocontributor","biocontributors","distant biocontributor","biosibling","biomate","biopartner","nanobro","nanofamily"])+Choose(["","",""," when I was "+Choose(["a kid","younger",Rand(30,120)])])+".",
		"The cycle I "+Choose(["learned how to "+Choose(["sprowse a ship","cook the old-timey way","love","kiss","forgive","forget","make friends on the nanoverse","speak my hundredth language","play "+Choose(["biano","prums","blitar","praxophone","videocards"])]),Choose(["graduated videoschool","graduated videocollege","got my sprowsing license"]),Choose(["got promoted as ","got a job as ","finally became "])+Choose(["a food pill designer","a videowriter","a videoverse engineer","a thoughtsprayer","a biomedic","a nanomedic","an exobiologist","a warfare engineer","a nanophysicist","a nanoscientist","a nanogeologist","a market intendant","a videoteacher","a historian","an archeologist","a videomusician","an videoartist","a bodyenhancer","a videodancer","a mindsensor","a commercial ship sprowser","a sprowseship engineer","a nanobot whisperer"])])+".",
		Choose(["Kissing","Cuddling with","Visualizing videoverses with","Staying up late with","Sharing mindsecrets with","Sharing childhood videomemories with","Feeling close to","Laying my arm around"])+" "+Choose(["that one person","my biomate","my biopartner","my nanobro"])+" in "+Choose(["videoschool","sprowsing school","videocollege"])+".",
		"The cycle I "+Choose(["got nanowed","biocontributed my biodaughter","biocontributed my bioson","lost a biocontributor","went on a trip with "+Choose(["my biomate","my biopartner","my nanobro","my nanofamily","my biocontributors"]),"learned "+Choose(["I","my bioson","my biodaughter","my biosibling","a biocontributor of mine"])+" had a nanodisease","learned we found a new galaxy","learned we met a new lifeform","got a new "+Choose(["leg","ankle","elbow","knee","nose","brain"]),"ended my biocontract with my biomate","lost my "+WeightedChoose(["dwog","cwat","bwunny","namster","werbil","bwird","rubyfish","fwerret","giant lizard","pet clam"],1.5)])+".",
		"That one unforgettable "+Choose(["videoverse","videomemory","mindsecret","cosmotrip","kiss","person I met","lifeform I met","party"])+"."
		],1.5);
		this.name=str;
	}
	else if (this.name=="*FUTURE THOUGHT*")
	{
		var str="";
		str+=WeightedChoose([
		Choose(["That's nice... that's really nice.","All of this stuff is so nice.","So nice, wow.","I need a couple decades on an exotic planet to cool off.","Oh boy, they've come up with a new food pill flavor!","Which food pills will I be ingesting today?","Who where?","Those are nice limbs. I bet they cost, uh, a lot, though.","I think I'll need more nanocredits.","We've come a long way.","What will we discover tomorrow?","This system is getting cramped.","I wonder - can we ever reverse entropy?","Meatspace's getting stale for me.","I'm still at least "+Rand(5,90)+"% meat!","I think I'll go visit some biorelatives.","Ugh. My biocontributors are visiting again.","One day I'll just upload myself.",Choose(["Needs","What this planet needs is","What we need as a species is","What I need is"])+" "+Choose(["more clones","more clams","more magnets","more nano","more nanostuff","more food pill flavors","more planets","more revived extinct species"])+".","These last few centuries have been a little boring.","I'll say, I'm a little bit bored.","I don't really give a clam's hinge.","Everything's so nano.","That's totally nano.","I wonder, where's my nanobro right now?","I hope we don't get assimilated.","I'm synthesizing "+Choose(["dinosaurs","trilobites","businessmen","birds","cavemen","clones","forbidden food","more nanogoo","moonclams","my own clone","a synthesizing machine","nanocredits"])+" and nobody can stop me!","I think I lost my "+Choose(["wall-vibrating device","transponder","synchotron","pocket biano","blitar","praxophone","moonclam","ID key"])+".","Time for "+Choose(["a new brainlobe","my nanomolting","a new arm","a new leg","a new pelvis","a new face","a new nanomate","my yearly checkup","some sprowsing","a good old videoverse"])+"!",Choose(["That videoverse's plot is barely believable.","That videoverse has some nicely-written characters.","I think this videoverse is too large for me.","I'm getting lost in this videoverse.","I can't view this videoverse anymore. Way too scary.","I can't stop crying at that videoverse..."])])
		],1.5);
		this.name=str;
	}
	else if (this.name=="*PAINTING*")
	{
		//Paintings ! Most of these end up sounding rather disturbing, I wonder why ?
		var str="";
		var objs=["apple","pear","peach","coconut","banana","fruit bowl","teapot","teacup","spoon","knife","fork","lemon","plate of pasta","baby","girl","boy","person","young man","young woman","man","woman","gentleman","lady","old person","businessman","salesman","ballerina","princess","prince","wizard","king","queen","witch","dragon","knight","singer","comedian","magician","artist","cook","clown","mime","dictator","president","flower pot","monster","creature","ice cream cone","cookie","fridge","oven","bunny","penguin","llama","horse","beetle","spider","bird","duck","mouse","bat","monkey","whale","fish","bear","shark","cat","dog","wolf","frog","snake","dolphin","chicken","brain","skeleton","skull","eyeball","rose","hat","robot","android","ghost","dinosaur","flower","tree","mushroom","worm","snowflake","clock","violin","tuba","saxophone","harp","piano","cosmic abomination","video game character","pizza slice","sphere","cube","ovoid","torus","square","triangle","line","dot","pyramid","abstract blob","hand","foot","beak","mouth","eye","tentacle","god","ancestor","unicorn","vampire","midget","giant","mountain","caveman","feather","bubble","detective","cop","spinning top","sponge","doll","train","manbox","person dressed as an animal","animal dressed as a person","moustache","fetus","egg","phone","television","computer","humanoid","anthill","beehive","octopus","couple","pair of shoes","mirror"];
		var adjs=["an ugly","a disfigured","a shapeless","a faceless","a rancid","a misshapen","a happy","a happy little","a plump little","a fat little","a sad","a giant","a miniature","a small","a huge","an insane","a crazy","a big-nosed","a big-mouthed","a long-eared","a scary","a talking","a jolly","a merry","a bearded","a tall","a stout","a smiling","a tap-dancing","a very distressed-looking","a depressed","a lovestruck","a wandering","an eerie","a sleepy","a lonely","a naked","a disturbing","a confused","an evil-looking","a headless","a tidy little","a moist","a shrivelled","an eyeless","a bulging","a murderous","a skinny","a skeletal","a ghostly","a tentacled","a monstrous","a horned","a robotic","a wooden","a metal","a translucent","a rad","a pretty cool","a well-dressed","a regretful","a hopeful","a famous","an infamous","a friendly","a flying","a winged","a jealous","a satisfied","a spiteful","an elegant","a dapper","a mirrored"];
		var tverbings=["harassing","dancing with","screaming at","yelling at","laughing at","smiling at","kissing","licking","arguing with","crying over","eating","mourning","devouring","killing","seducing","courting","hanging out with","having a chat with","drawing","painting","running towards","insulting","stabbing","tickling","nibbling","hugging","watching","looking at","staring at","pointing at","running away from","chasing","stalking","following","holding hands with","being mean to","being nice to","sharing toys with","tearing apart","trying to touch","reaching for","giving birth to","cleaning up","strangling","exploring with","lasering","cutting up","singing for","intimidating","ignoring","trying to eat","suffocating under the weight of","searching for","fishing for","trying to lure","explaining something to","laying on","jumping on","stomping on","marrying","rejecting","playing with","toying with","fused to","softly rubbing","spreading jam on","drooling on","climbing on","stepping on","putting a hat on"];
		var verbings=["dancing","screaming","crying","laughing","flying","sleeping","resting","thinking","tap-dancing","smiling","meditating","wiggling","jiggling","looking away","shivering","shaking","trembling","moaning","drooling","twitching","spinning","melting","phasing out of existence","breathing heavily","dying","slowly dying","floating away","looking terrified","looking happy as can be","playing music","reading a book","losing all sanity","slowly coming this way","stifling laughter","pretending not to notice anything","yawning","singing","stretching","taking notes","teleporting","drowning","suffocating","vomiting","flying away","swimming away","shapeshifting","changing shapes","morphing into something else","tearing apart","bursting into treats","trying to escape death","sobbing sadly","clapping","staring at the viewer","blowing a raspberry","making a prank call","looking upset","looking bored","looking sad","jogging","spilling spaghetti","looking satisfied","partying","skiing","rotting away","wearing a hat"];
		var locs=["in outer space","in the moonlight","under a starry night","under a red sky","under an otherworldly sky","in a kitchen","among the clouds","in the sky","on a table","in a blank room","outside a house","in a dark room","on a bed","on a couch","in a living-room","in front of a house","on top of a house","in the ocean","on the beach","on an airplane","on a boat","in front of a window","on top of a building","on the town square","in a dark cave","in the forest","in the desert","on top of a mountain","in a snowy landscape","in a storm","in an urban setting","in a metropolis","in a bar","at a party","in a medieval setting","in a futuristic setting","in a restaurant","in an elegant stairway","in a castle","in a lavish palace","in a museum","in an ancient temple","in an alien construction","in an industrial landscape","on a movie set","in an opera","surrounded by strange contraptions","in a laboratory","surrounded by geometric patterns","in an abstract landscape","in a geometric landscape","on an alien planet","in a bloody landscape","in a bleak landscape","in a post-apocalyptic landscape","in an alternate dimension","in a historic scene","in a bathroom","in a romantic setting","surrounded by ruins","in a library","underwater","in a wasteland","in a long, dark corridor","in a dark alley","surrounded by dancing figures","surrounded by judging faces","surrounded by twisted statues","under the rain","atop a hill","in the sewers","on a moon's surface"];
		
		str+=WeightedChoose(["A painting of","A portrait of","A picture of","A photograph of","A rendition of","A sculpture of","A bas-relief of","An installation of","A series of pictures representing","A series of photographs showing","A model of","A dyptic of","A tryptic of"],3)+" ";
		str+=Choose(["$adj $obj $loc.","$adj $obj $verbing $loc.","$adj $obj $loc. The $obj is $verbing.","$adj $obj and $adj2 $obj2 $loc. The $obj is $tverbing the $obj2.","$adj $obj and $adj2 $obj2 $loc. The $obj2 is $verbing, and the $obj is $verbing2.","$adj $obj $tverbing $adj2 $obj2. The $obj2 is $verbing.","$adj $obj $tverbing $adj2 $obj2 $loc."]);
		
		str=str.split("$verbing2").join(Choose(verbings));
		str=str.split("$verbing").join(Choose(verbings));
		str=str.split("$tverbing").join(Choose(tverbings));
		str=str.split("$loc").join(Choose(locs));
		str=str.split("$adj2").join(Choose(adjs));
		str=str.split("$obj2").join(Choose(objs));
		str=str.split("$adj").join(Choose(adjs));
		str=str.split("$obj").join(Choose(objs));
		
		this.name=str;
	}
	else if (this.name=="*NOTE*")
	{
		//Notes found hidden in people's pockets, etc. Can contain recipes, laundry bills, or creepy observations.
		var str="";
		str+=Choose([
		Choose(["I'm sorry.","I regret everything.","I regret nothing!","Please don't judge me.","I wish things went otherwise.","I didn't know what to say.","Thanks for the dinner."+Choose([""," It was great."," I enjoyed it."]),"I have this "+Choose(["neat","cool","awesome","stupid"])+" idea for "+Choose(["a book","a joke","a story","a film"])+". It involves "+Choose(["pirates","ninjas","dinosaurs","unicorns","robots","cyborgs","scientists","superheroes","maths"])+", "+Choose(["surgeons","penguins","dolphins","cheese","dragons","ghosts","kittens","sarcasm","astronomers","banana peels"])+" and "+Choose(["spaceships","vegetarians","babies","art","time travel","abortions","philosophy","computers","punctuation","magnets","geometry","language"])+".","Socks and sandals. Because I can.","I like shorts. They're comfy and easy to wear.","Ski masks are in right now.","Recipe for happiness :<br>1)?","How to be happy :<br>-eat well<br>-sleep early<br>-don't ask questions","Hey.<br>I'll show you something neat :<br>add?seed=*** to the url<br>and replace *** by whatever you want,<br>like person or bookshelf or ocean.","You will find the strangest things in the oddest places.","I'd love to learn a foreign language. But they don't seem to exist...","Alright, how comes everybody in the universe has an american name?"]),
		Choose(["I know who you are.","I see you.","Stop looking through my stuff!","So, I was right after all? You were sifting through my stuff?","They don't know where I hid it.","Hi!","Hello there!","Pay attention.","I'm proud of you.","Don't look behind you.","It's on its way to find you now.","Let's not get too meta.","we are all nested<br>we are all viewed<br>we are all viewing<br>nested<br>nesters<br>nestees<br>all is one","Well? Did you?","OH MY GOD<br>WHAT IF SOMEONE IS LOOKING AT ALL THIS RIGHT NOW","I found myself in a website once.","But for real though. Nothing is of any significance to anything. There is no overarching story. There is no grand scheme of things. There is only here and now.","Tell you what. None of this is randomly generated. All this data is actually being transferred from the real world.","Every time you refresh, a new universe is being born just for you. Think about it before you close the page.","Did you know? A team of 781 persons worked on this game for 11 years, painstakingly adding in every single thing they could think of.","aint no universe like a nested universe","this party gettin started or what","it aint stopping oh god","There is no Nested; only shark.","Nothing makes sense, and nothing ever will.","There's no real point to anything, and that's okay.","Hands off, you plebeian!","Everything is fine. Everything is fine. Everything is fine. There is nothing to worry about. Nothing at all.","I have a secret for you. Wait no, I don't.","Tell me a secret. Wait. I don't care.","(The note is "+Choose(["burnt","partly-burnt","washed-off","bleached","covered in scribblings","covered in strange symbols","covered in intricate patterns","covered in densely-written instructions"])+" and indecipherable.)","This universe is so. Very. Large.",Choose(["A","B","C","D","E","F","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"])+Rand(0,9)+""+Rand(0,9)+""+Rand(0,9)+""+Rand(0,9)+""]),
		Choose(["Laundry service : $"+Rand(10,50)+"."+Rand(0,9)+"0"]),
		Choose(["Recipe :<br>-"+Choose(["toast","bagel","breadstick","garlic bread","pita","taco shell"])+"<br>-"+Choose(["eggs","ground beef","fries","ice cream","mashed potatoes"])+"<br>-"+Choose(["chocolate syrup","whipped cream","cheese","mayonaise","vinegar","tabasco","cough syrup","soy sauce"])])
		]);
		this.name='"'+str+'"';
	}
	else if (this.name=="*BOOK*")
	{
		//This is probably my favorite name generator.
		var str="";
		str+=Choose([
		Choose(["All about ","Of ","Everything you need to know about","The definitive guide to","A beginner's guide to","How to deal with","Dealing with","Hanging out with","Making friends with","I fell in love with","Falling in love with","The shocking truth about","They're serious :","Here's a book about","A conversation with","Why we need more","Nobody understands","Who cares about","A study on","These are not my","Say no to","Getting away from","Getting along with","Avoiding","Approaching","Investigating","Not worth it :","Stay away from","Never underestimate","Anatomy of","I hate","I love","Who hates","Who loves","They were","Living with","Cooking with","Cooking for",Rand(10,200)+" recipes for","A few words on","They know where you live :","What I think about","What you didn't know about","The truth on","What they don't show you about","Hey look,","Aw crap,","Holy crap,","Understanding","Getting rid of","Delicious","They're okay :","Licking","Reasoning with","You can't explain that :","Drawing","Choosing your","Night of the","Day of the","Revenge of the","The book of","The big book of","Those aren't my","Hey everyone,","The chorus of"])+" "+Choose(["weird","mutant","normal","serious","elongated","exploding","obese","skinny","whiny","stupid","slimy","creamy","tiny","small","giant","gigantic","ancient","tasty","obnoxious","invisible","shiny","boring","confused","lost","lonely","curly","frilly","friendly","annoying","space","green","orange","purple","mauve","transparent","stilted","hairy","bald","ridiculous","demanding","imaginary","awkward","stubborn","pretentious","naughty","nasty","lazy","fancy","magic","clumsy","smelly","bearded","sleazy","rabid","translucent","edible","inedible","foreign","snotty","mind-reading","telepathic","silent"])+" "+Choose(["shrimps","birds","people","friends","relatives","chappies","whales","deities","cactii","fungi","shellfish","alligators","jellyfish","crabs","hoboes","machines","robots","goats","cyborgs","ninjas","fish","mushrooms","mammals","reptiles","amphibians","cephalopods","spiders","fossils","moustaches","perverts","mermaids","squids","lampreys","seafood","turtles","unicorns","barbarians","vampires","werewolves","teenagers","babies","kids","ladies","superheroes","roads","hats","insects","centaurs"]),
		Choose(["Tales of","Chronicles of","A history of","The gates of","Objective : ","Reaching for","War for","Battle for",Choose(["Money","A savior","A wizard","A warrior","A hero","A prince","A king","A princess","A queen","Cake","Booze"])+" for","The ruins of","The prophet of","Zealots on","Mysteries of","The temple of","The vagrant from","The nights of","Conquerors from","They came from","The spaceships on","The soldiers of","The warrior from","On the moons of","Saving","Glory for","Rulers of","Kings of","Lords of","Princes of"])+" "+Choose(["G","P","S","St","Sh","B","F","K","Z","Az","Oz"])+Choose(["","","","r","l"])+Choose(["u","o","a","e"])+Choose(["r","sh","nd","st","sd","kl","kt","pl","fr","ck","sh","ff","gg","l","lig","rag","sha","pta","lir","limd","lim","shim","stel"])+Choose(["i","u","o","oo","e","ee","y","a"])+Choose(["ll","th","h","k","lm","r","g","gh","n","m","p","s","rg","lg"]),
		Choose([Choose(["How to","Learning how to","Teaching yourself how to"])+" "+Choose(["knit","dance","swim","cook","play piano","program","be cool","be popular","be friendly","be nice","be smarter","stay fit","be succesful","make money","be funny","find a job","write books","make a website","play chess","do magic tricks","do yoga","be happy"]),Choose(["A beginner's guide to","All about","Everything you need to know about","The basics of","The secrets of","The definitive guide to","Advanced techniques for"])+" "+Choose(["knitting","dancing","swimming","cooking","playing piano","programming","being cool","being popular","being friendly","being nice","getting smarter","staying fit","being succesful","making money","being funny","finding a job","writing books","making websites","playing chess","magic tricks","yoga","happiness"])]),
		Choose(["",Choose(["The",Choose(["The amazing","The ridiculous","The heart-warming","The retarded","The downright retarded","The stupid","The simply stupid","The insulting","The repulsive","The revolting","The delightful","The distracting","The flabbergasting","The mind-numbing","The silly","The clever","The boring","The idiotic","The hilarious","The endless","The illustrated"])])+" "+Choose(["adventure","adventures","tale","tales","story","stories","happenings","stumblings","discoveries"])+" of "])+Choose([WeightedChoose(["James","John","Robert","Michael","William","David","Richard","Charles","Joseph","Thomas","Christopher","Daniel","Paul","Mark","Donald","George","Kenneth","Steven","Edward","Brian","Ronald","Anthony","Kevin","Jason","Jeff","Jack"],1.5),Choose(["A","Ana","Ba","Bo","Bra","Bro","Bee","Bea","Bre","Bi","Ca","Cla","Co","Da","Dee","Dri","E","Fa","Fi","Fo","Fro","Go","Ga","Gri","Gi","Gnu","Ha","Ho","I","Jo","Ja","Je","Kla","Ko","Klo","Lo","Lee","Mi","Ma","Mu","Ni","Nee","O","Oo","Pi","Pa","Po","Qua","Quo","Quee","Ri","Ra","Ro","Sti","Sla","Shwa","Shwo","To","Tra","U","Vo","Vro","Wo","Wee","Wi","Xi","Y","Zi","Zo","Za"])+Choose(["bble","rble","pple","ttle","ffle","stle","ffin","ggin","ggle","rgle","rbus","rtus","bus","tus","gus","rtus","rtos","zzle"])])+Choose([" the",", the "+Choose(["amazing","stupid","boring","diminutive","giant","friendly","psychotic","crafty","swift","cowardly","mighty","hilarious","magic","midget","tiny","clumsy","lazy","fancy","nasty","naughty","hairy","bald","disgusting","smelly","failed","noble"])])+" "+Choose(["bard","poet","prince","knight","wizard","sorcerer","tourist","shopkeeper","joker","blacksmith","butcher","gardener","magician","mage","astronomer","alchemist","merchant","pirate","ninja","shoemaker","monk"])+Choose(["","","","",""," "+Choose(["from space"])]),
		Choose(["A shocking","An amazing","A vibrant","A heart-warming","A true","An astounding","A riveting","A twisted","A short","An elaborate","An overly elaborate","A ridiculous","A hilarious","A boring","An illustrated","A mind-numbing","A"])+" "+Choose(["story","tale","essay","book"])+" "+Choose(["involving","about","on the subject of"])+" "+Choose(["pirates","ninjas","dinosaurs","unicorns","robots","cyborgs","scientists","superheroes","maths"])+", "+Choose(["surgeons","penguins","dolphins","cheese","dragons","ghosts","kittens","sarcasm","astronomers","banana peels"])+" and "+Choose(["spaceships","vegetarians","babies","art","time travel","abortions","philosophy","computers","punctuation","magnets","geometry","language"]),
		Choose(["","",Choose(["Meet","Hey, it's","The life of","My life as","The day I woke up as","My life with","Living with","My friend","Me and my friend","My buddy","Me and my buddy","My neighbor"])+" ",Choose(["The",Choose(["The amazing","The ridiculous","The heart-warming","The retarded","The downright retarded","The stupid","The simply stupid","The insulting","The repulsive","The revolting","The delightful","The distracting","The flabbergasting","The mind-numbing","The silly","The clever","The boring","The idiotic","The hilarious","The endless","The illustrated"])])+" "+Choose(["adventure","adventures","tale","tales","story","stories","happenings","stumblings","discoveries"])+" of "])+Choose([WeightedChoose(["James","John","Robert","Michael","William","David","Richard","Charles","Joseph","Thomas","Christopher","Daniel","Paul","Mark","Donald","George","Kenneth","Steven","Edward","Brian","Ronald","Anthony","Kevin","Jason","Jeff","Jack"],1.5),WeightedChoose(["Mary","Patricia","Linda","Barbara","Elizabeth","Jennifer","Maria","Susan","Margaret","Dorothy","Lisa","Nancy","Karen","Betty","Helen","Sandra","Donna","Carol","Ruth","Sharon","Michelle","Laura","Sarah","Kimberly","Deborah"],1.5)])+", the "+Choose(["weird","mutant","normal","serious","confused","lost","exploding","obese","skinny","whiny","stupid","slimy","tiny","giant","ancient","obnoxious","invisible","boring","annoying","space","hairy","bald","ridiculous","imaginary","awkward","stubborn","pretentious","naughty","nasty","lazy","fancy","magic","clumsy","smelly","bearded","lonely","sleazy","rabid","translucent","edible","inedible","foreign","snotty","mind-reading","telepathic","silent"])+" "+Choose(["shrimp","bird","person","chap","whale","deity","cactus","fungus","alligator","jellyfish","crab","hobo","machine","robot","goat","cyborg","ninja","fish","mushroom","spider","pervert","mermaid","squid","lamprey","turtle","unicorn","barbarian","vampire","werewolf","teenager","baby","kid","lady","superhero","insect","centaur","shopkeeper","caveman","school teacher","cosmonaut","scientist","doctor","car salesman","baker","butcher","cop","minister"])
		]);
		if (Rand(0,10)==0) str+=", "+Choose(["Part","Tome","Volume"])+" "+Choose(["I","II","III","IV","V","VI","VII","VIII","IX","X"]);
		this.name=Title(str);
	}
	else if (this.name=="*CHAR*")
	{
		var str="";
		str="aaaabbccddeeeeffgghhhiijkkllmmnnooppqqrrrssstttuuvwwxyz.,;!?:()-'";
		if (Rand(0,20)==0) str+="0123456789*$/#&";
		str=str.split("");
		str=Choose(str);
		if (Rand(0,30)==0) str=str.toUpperCase();
		this.name=str;
	}
	else if (this.name=="*MONUMENT*")
	{
		var str="";
		str+=Choose([
		Choose([Choose([WeightedChoose(["old","new","ancient","historic","royal","imperial","sunken","painted","crooked","slanted","high","rising","underground","immersed","twisted","shaky","lucky","glorious","flying"],2),WeightedChoose(["great","big","large","giant","huge","grand","gigantic","colossal","tremendous","humongous"],0.5)])+" "])+Choose(["","","",Choose(["stone","gold","silver","copper","bronze","metal","white","black","blue","green","yellow","red","grey","crimson","azure","viridian"])+" "])+WeightedChoose(["tower",Choose(["","smiling ","proud ","wise ","horse ","freedom ","watching ","crying ","singing "])+"statue","bridge","park","towers","palace","statues","gardens","parks","cathedral","ruins","wall","church","maze","castle","radio tower","arena","keep","colossus","space needle","house","villa","manor","dungeon","opera","pyramid","cave","ark","wheel"],5)
		]);
		str="The "+str;
		this.name=Title(str);
	}

	if (nameParts[1]!=undefined) this.name=this.name+nameParts[1];

}

Instance.prototype.Grow=function()
{
	if (this.grown==false)
	{
		this.Name();
		for (var i in this.type.contains)
		{
			toMake=this.type.contains[i];
			if (typeof(toMake)!="string")
			{toMake=Choose(toMake);}
			toMake=toMake.split(",");
			var makeAmount=1;
			var makeProb=100;
			if (toMake[1]==undefined) toMake[1]=1;
			else
			{
				makeAmount=toMake[1].split("-");
				if (makeAmount[1]==undefined) makeAmount=makeAmount[0]; else
				{
					makeAmount=Rand(makeAmount[0],makeAmount[1]);
				}
				makeProb=(toMake[1]+"?").split("%");
				if (makeProb[1]!=undefined) {makeProb=makeProb[0];makeAmount=1;} else makeProb=100;
			}

			if (Things[toMake[0]]!=undefined)
			{
				if (Math.random()*100<=makeProb)
				{
					for (var ii=0;ii<makeAmount;ii++)
					{
						var New=Make(Things[toMake[0]].name);
						New.parent=this;
						this.children.push(New);
					}
				}
			}

		}
		this.grown=true;
	}
}


Instance.prototype.List=function()
{
	var str="";
	var addStyle="";
	for (var i in this.children)
	{
		str+='<div id="div'+this.children[i].n+'">'+this.children[i].name+'</div>';
	}
	//special-case pictures
	if (this.name=="sharkverse") addStyle="background-image:url('nestedSharkverse.png');";
	else if (this.name=="baconverse") addStyle="background-image:url('nestedBaconverse.png');";
	else if (this.name=="doughnutverse") addStyle="background-image:url('nestedDoughnutverse.png');";
	else if (this.name=="lasagnaverse") addStyle="background-image:url('nestedLasagnaverse.png');";
	//if (this.children.length>0) document.getElementById("div"+this.n).innerHTML='<span onclick="Toggle('+this.n+');"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</span><div id="container'+this.n+'" class="thing" style="display:none;">'+str+'</div>';
	if (this.children.length>0) document.getElementById("div"+this.n).innerHTML='<a href="javascript:Toggle('+this.n+');" style="padding-right:8px;" alt="archetype : '+(this.type.name)+'" title="archetype : '+(this.type.name)+'"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</a><div id="container'+this.n+'" class="thing" style="display:none;'+addStyle+'">'+str+'</div>';
	else document.getElementById("div"+this.n).innerHTML='<span class="emptyThing">'+this.name+'</span>';
}

function Make(what)
{
	return new Instance(what);
}

function Debug(what)
{
	document.getElementById("debug").innerHTML=document.getElementById("debug").innerHTML+'<br>'+what;
}

function Toggle(what)
{
	if (Instances[what].display==0)
	{

		for (var i in Instances[what].children)
		{
			if (Instances[what].children[i].grown==false) {Instances[what].children[i].Grow(0);Instances[what].children[i].List(0);}
		}


		Instances[what].display=1;
		document.getElementById("container"+what).style.display="block";
		document.getElementById("arrow"+what).innerHTML="-";
	}
	else if (Instances[what].display==1)
	{
		Instances[what].display=0;
		document.getElementById("container"+what).style.display="none";
		document.getElementById("arrow"+what).innerHTML="+";
	}
}



//And now, the fun begins!

//How to add a new Thing :
//	new Thing(name,contains,name generator);
//		-name is the referral name for this Thing. Unless a name generator is specified, this name will be the default name for any instances of this Thing.
//		-contains is an array of Things that an instance of this Thing contains, specified by their name.
//			-For example, ["banana"] means this Thing contains exactly 1 instance of a banana. ["banana","orange"] means it contains 1 banana and 1 orange.
//			-["banana","strawberry,25%"] means it will contain 1 banana, and has a 25% probability of also containing a strawberry.
//			-["banana,2-7"] means it will contain between 2 and 7 bananas.
//			-[".banana"] will not include a banana in the Thing; instead, the Thing will contain whatever the banana normally contains.
//			-["banana",["sugar","honey"]] will include a banana, and either sugar or honey. Unfortunately, this does not work with the format ".sugar" or ".honey".
//		-name generator is optional; if specified, the instance of the Thing will be named according to this.
//			It can be either an array containing other arrays (the name will be patched up from an element of each array) or an identifier for the Name function, like *BOOK*.
//			A name generator of [["blue ","red "],["frog","toad"]] will produce names such as "blue frog" or "red toad".

//basic materials and particles
//(these are very rough simplifications, don't hold all the inaccuracies against me)
new Thing("diamond",["carbon"]);
new Thing("oil",["lipids"]);
new Thing("magma",[".rock"]);
new Thing("rock",["silica","aluminium,30%","iron,20%","potassium,20%","sodium,50%","calcium,50%"]);
new Thing("silica",["silicon","oxygen"]);
new Thing("chitin",["carbon","hydrogen","oxygen","nitrogen"]);
new Thing("salt",["chlorine","sodium"]);
new Thing("water",["hydrogen","oxygen"]);
new Thing("fire",["oxygen","carbon"]);
new Thing("ash",["organic matter","carbon"]);
new Thing("dew",["water"]);
new Thing("ice",["water"]);
new Thing("snow",["snowflakes"]);
new Thing("snowflakes",["water"]);
new Thing("ammonia",["hydrogen","nitrogen"]);
new Thing("methane",["hydrogen","carbon"]);
new Thing("hydrogen",[".hydrogen atom"]);
new Thing("hydrogen atom",["proton","electron"],["atoms"]);
new Thing("plastic",["polymers"]);
new Thing("rubber",["polymers"]);
new Thing("polymers",[".glucids"]);
new Thing("alcohol",[".glucids"]);
new Thing("carbon",[".atom"]);
new Thing("sodium",[".atom"]);
new Thing("chlorine",[".atom"]);
new Thing("oxygen",[".atom"]);
new Thing("helium",[".atom"]);
new Thing("potassium",[".atom"]);
new Thing("aluminium",[".atom"]);
new Thing("iron",[".atom"]);
new Thing("copper",[".atom"]);
new Thing("lead",[".atom"]);
new Thing("steel",["iron","carbon"]);
new Thing("gold",[".atom"]);
new Thing("silver",[".atom"]);
new Thing("silicon",[".atom"]);
new Thing("calcium",[".atom"]);
new Thing("nitrogen",[".atom"]);
new Thing("sulfur",[".atom"]);
new Thing("phosphorus",[".atom"]);
//alright, I'm not doing the whole periodic table.
new Thing("proteins",[".molecule"]);
new Thing("lipids",[".molecule"]);
new Thing("glucids",["carbon","hydrogen","oxygen"],"glucose");
new Thing("organic matter",[["proteins","lipids","glucids"],["proteins","lipids","glucids",""],"salt,30%"]);
new Thing("atom",["proton","neutron","electron"],["atoms"]);
new Thing("molecule",["atom"],["molecules"]);
new Thing("proton",["up quark,2","down quark"]);
new Thing("neutron",["down quark,2","up quark"]);
new Thing("electron",["qwubble"]);
new Thing("up quark",["qwubble"]);
new Thing("down quark",["qwubble"]);
new Thing("qwubble",["multiverse,1-5"]);
new Thing("portal",["universe"]);

//universe stuff
new Thing("multiverse",["universe,10-30"],["multiverse","lasagnaverse","doughnutverse","towelverse","baconverse","sharkverse","nestedverse","tastyverse","upverse","downverse","layerverse","clusterverse","metaverse","quantiverse","paraverse","epiverse","alterverse","hypoverse","dimensioverse","planiverse","pluriverse","polyverse","maniverse","stackoverse","antiverse","superverse","upperverse","maxiverse","megaverse","babyverse","tinyverse","retroverse","ultraverse","topoverse","otherverse","bubbleverse","esreverse","versiverse","'verse","cookieverse","grandmaverse"]);
new Thing("universe",["supercluster,10-30"]);
new Thing("supercluster",["galaxy,10-30"],"galactic supercluster");
new Thing("galaxy",["galaxy center","galaxy arm,2-6"]);
new Thing("galaxy arm",["galactic life,5%","dyson sphere,4%","dyson sphere,2%","star system,20-50","nebula,0-12","black hole,20%","black hole,20%"],"arm");
new Thing("galaxy center",["black hole","galactic life,10%","dyson sphere,4%","dyson sphere,2%","star system,20-50","nebula,0-12"],"galactic center");
new Thing("nebula",["galactic life,15%","star,2%","star,2%","star,2%","interstellar cloud,1-6"]);
new Thing("interstellar cloud",["helium","hydrogen","carbon,80%","water,5%","ammonia,5%","nitrogen,5%","iron,5%","sulfur,5%","oxygen,15%"],[["a bright pink","a faint","a fading","a pale","a fluo","a glowing","a green","a bright green","a dark brown","a brooding","a magenta","a bright red","a dark red","a blueish","a deep blue","a turquoise","a teal","a golden","a multicolored","a silver","a dramatic","a luminous","a colossal","a purple","a gold-trimmed","an opaline","a silvery","a shimmering"],[" "],["interstellar cloud"]]);
new Thing("star system",["star","star,3%","visitor planet,5%","future planet,10%","future planet,10%","terraformed planet,50%","terraformed planet,20%","terraformed planet,10%","medieval planet,30%","medieval planet,20%","ancient planet,50%","ancient planet,30%","ancient planet,10%","barren planet,60%","barren planet,40%","barren planet,20%","gas giant,60%","gas giant,40%","gas giant,20%","gas giant,10%","asteroid belt,0-2"]);
new Thing("dyson sphere",["star","star,3%","dyson surface","future planet,1-8","barren planet,60%","barren planet,40%","barren planet,20%","gas giant,60%","gas giant,40%","gas giant,20%","gas giant,10%","asteroid belt,0-2"]);
new Thing("star",["ghost,0.1%","space monster,0.2%","hydrogen","helium"],[["white","faint","yellow","red","blue","green","purple","bright","double","twin","triple","old","young","dying","small","giant","large","pale","dark","hell","horrific","twisted","spectral"],[" star"]]);
new Thing("planet",[".terraformed planet"],"telluric planet");
new Thing("barren planet",["galactic life,10%","rock","ice,50%",".planet composition"],"telluric planet");
new Thing("visitor planet",["visitor city,1-8","visitor installation,2-6","galactic life","rock","ice,50%",".planet composition"],"telluric planet");
new Thing("future planet",["future continent,2-7","ocean,1-7","future sky",".future moon,30%",".planet composition"],"telluric planet");
new Thing("terraformed planet",["continent,2-7","ocean,1-7","terraformed sky",".terraformed moon,30%",".planet composition"],"telluric planet");
new Thing("medieval planet",["medieval continent,2-4","ancient continent,0-3","ocean,1-7","sky",".planet composition"],"telluric planet");
new Thing("ancient planet",["ancient continent,2-7","ocean,1-7","sky",".planet composition"],"telluric planet");
new Thing("planet composition",["planet core","moon,40%","moon,20%","moon,10%"],"planet");
new Thing("moon",["ghost,0.1%","rock","planet core"],[["young","old","large","small","pale","white","dark","black","old"],[" moon"]]);
new Thing("terraformed moon",[".planet composition","continent,1-4","ocean,1-4","sky"],[["young","old","large","small","pale","white","dark","black","old","green","lush","blue","city","colonized","life"],[" moon"]]);
new Thing("asteroid belt",["galactic life,20%","asteroid,10-30"]);
new Thing("earth",[".asteroid belt"],"Earth");
new Thing("asteroid",["space animal,0.5%","rock","ice,30%"],"asteroid");
new Thing("gas giant",["gas giant atmosphere","planet core,50%","moon,0-3","terraformed moon,20%","terraformed moon,10%"]);
new Thing("gas giant atmosphere",["galactic life,10%","helium","hydrogen","water,50%","ammonia,50%","methane,50%"],"atmosphere");
new Thing("planet core",["space monster,0.5%","iron","rock","diamond,2%","magma"],"core");

new Thing("black hole",["inside the black hole"]);
new Thing("inside the black hole",["end of universe note,0.5%","crustacean,0.2%","white hole"]);
new Thing("white hole",["universe"]);
new Thing("42",["universe"]);
new Thing("everything",["universe"]);
new Thing("end of universe note",["pasta,0.1%"],["Help! I'm trapped in a universe factory!","Okay, you can stop clicking now.","I want to get off Mr Orteil's Wild Ride","my sides"]);
new Thing("orteil",["body","orteil psyche","clothing set","computer"],"Orteil");//I do what I want
new Thing("god",[".orteil"],"Orteil");//I'm a fucking god
new Thing("orteil psyche",["orteil thoughts"],"psyche");
new Thing("orteil thoughts",[],["OH MY GOD WHAT ARE YOU DOING HERE TURN BACK IMMEDIATELY","WHAT IS WRONG WITH YOU","WHAT THE HELL GO AWAY","WHAT ARE YOU DOING OH GOD","WHY THE HELL ARE YOU HERE","I DO WHAT I WANT OKAY","NO I DON'T CARE GO AWAY","WHAT DID I EVEN DO TO YOU","OH NO WHY THIS","OKAY JUST <a href=\"http://orteil.deviantart.com\">GO THERE ALREADY</a>","<a href=\"http://twitter.com/orteil42\">WHATEVER</a>"]);



//cell stuff
new Thing("cell",["nucleus","cytoplasm"],["cells"]);
new Thing("nucleus",["dna","proteins"]);
new Thing("cytoplasm",["glucids","lipids"]);
new Thing("dna",["genetic code","hydrogen","oxygen","nitrogen","carbon","phosphorus"],"DNA");
new Thing("genetic code",["nucleotide,20-50"]);
new Thing("nucleotide",["molecule"],["A","T","G","C"]);

//body stuff
new Thing("body part",["bacteria,30%","bacteria,10%","skin","blood vessels","bones","fat","muscles"],"body part");
new Thing("soft body part",["bacteria,30%","bacteria,10%","skin","blood vessels","fat","muscles"],"body part");
new Thing("skinless body part",["bacteria,30%","bacteria,10%","blood vessels","bones","fat","muscles"],"body part");
new Thing("skinless soft body part",["bacteria,30%","bacteria,10%","blood vessels","fat","muscles"],"body part");
new Thing("blood vessels",["bacteria,30%","blood"],"blood vessels");
new Thing("blood",["blood cell"],"blood");
new Thing("blood cell",[".cell"],["blood cells"]);
new Thing("skin",["bacteria,1-3","scar,0.5%","pores","skin cell","dead skin","dust,20%","sweat,20%"],"skin");
new Thing("scar",["dead skin"]);
new Thing("pores",["bacteria,1-3","skin cell","dead skin,50%","sweat,40%"],"pores");
new Thing("skin cell",[".cell"],["skin cells"]);
new Thing("dead skin",["skin cell"]);
new Thing("bone",[".bones"],"bone");
new Thing("bones",["bone cell","calcium"],"bones");
new Thing("bone cell",[".cell"],["bone cells"]);
new Thing("muscles",["muscle cell"],"muscles");
new Thing("muscle cell",[".cell"],["muscle cells"]);
new Thing("fat",["lipids"],"fat");
new Thing("brain cell",[".cell"],["brain cells"]);
new Thing("dandruff",["dead skin"]);

new Thing("clothing set",["hat,2%","glasses,20%","pants,98%","shirt,98%","coat,50%","socks,80%","shoes,80%","underwear,99%"],"clothing");
new Thing("man",[".person"],"*MAN*");
new Thing("woman",[".person"],"*WOMAN*");
new Thing("person",["body","psyche","clothing set"],"*PERSON*");
new Thing("corpse",["body","clothing set","blood,35%","worm,20%","worm,10%"],"*PERSON*| (dead)");
new Thing("body",["head","torso","arm,99%","arm,99%","leg,99%","leg,99%"],"body");
new Thing("torso",["chest","pelvis",".body part"]);
new Thing("chest",["nipple,2","bellybutton",".body part"]);
new Thing("bellybutton",["skin","lint,0-1"]);
new Thing("nipple",["skin"]);
new Thing("pelvis",["naughty bits","butt",".body part"]);
new Thing("naughty bits",[".soft body part"]);
new Thing("butt",["pasta,0.01%","sweat,50%",".body part"]);
new Thing("arm",["hand","elbow","armpit",".body part"],"arm");
new Thing("hand",["finger,5",".body part"]);
new Thing("finger",["fingernail",".body part"],"finger");
new Thing("fingernail",["dust,30%","keratin"],"fingernail");
new Thing("elbow",[".body part"]);
new Thing("armpit",["armpit hair","sweat,80%",".soft body part"]);
new Thing("armpit hair",[".hair"],"hair");
new Thing("leg",["foot","knee",".body part"],"leg");
new Thing("foot",["toe,5","sweat,30%",".body part"]);
new Thing("toe",["toenail",".body part"],"toe");
new Thing("toenail",["dust,40%","keratin"],"toenail");
new Thing("knee",[".body part"],"knee");
new Thing("head",["mouth","nose","eye,99%","eye,99%","ear,2","skull","head hair,85%",".body part"],"head");
new Thing("eye",["eyelashes","eye flesh","tear,2%"],"eye");
new Thing("eye flesh",["water","blood vessels","fat"],"eyeball");
new Thing("eyelashes",[".hair"],"eyelashes");
new Thing("tear",["water","salt"]);
new Thing("ear",[".soft body part"],"ear");
new Thing("brain",["bacteria,20%","brain cell"],"brain");
new Thing("skull",["brain",".bones"]);
new Thing("head hair",[".hair","dandruff,10%"],[["brown","black","gray","light","blonde","red","dark"],[" hair"]]);
new Thing("hair",["bacteria,30%","keratin"],"hair");
new Thing("nose",["nostril,2",".body part"],"nose");
new Thing("nostril",["nostril hair","boogers,0-1",".soft body part"],"nostril");
new Thing("nostril hair",[".hair"],"nostril hair");
new Thing("boogers",["organic matter"]);
new Thing("mouth",["teeth","tongue"],"mouth");
new Thing("teeth",["calcium","phosphorus"],"teeth");
new Thing("tongue",["muscles"],"tongue");

new Thing("abomination",["abomination body","abomination psyche"],"*PERSON*| (abomination)");//nonononononono
new Thing("abomination psyche",["abomination thoughts","memories"],"psyche");
new Thing("abomination thoughts",["black hole,0.01%","abomination thought"],"thoughts");
new Thing("abomination thought",[],["P-please...","Don't look at me...","Please... kill me...","Kill... me...","Why would I ever ask for this...","I only wish for death.","I only long for death now.","I only demand... death...","End my misery... I beg you...","This is a mockery of existence...","I miss her so much...","I miss him so much...","I miss my family...","Why would they do that to me...","How could they do this to me...","What have I become...","I feel... different...","I can't feel... anything...","I can't... see anything..."]);
new Thing("abomination body",["abomination head","abomination head,5%","abomination torso",["arm,0-8","arm,0-4"],["leg,0-8","leg,0-4"],"crustacean claw,2%","stinger,2%","weird soft organ,10%","weird soft organ,10%","weird hard organ,10%","weird hard organ,10%"],"misshapen body");
new Thing("abomination head",["mouth,0-2","nose,0-2","eye,0-8","ear,0-4","skull,90%","weird soft organ,20%","weird hard organ,20%","head hair,65%",".body part"],"misshapen head");
new Thing("abomination torso",["chest","chest,10%","pelvis","pelvis,10%","weird soft organ,20%","weird hard organ,20%",".body part"],"misshapen torso");

//brain stuff
new Thing("psyche",["thoughts","memories"],"psyche");
new Thing("thoughts",["black hole,0.01%",["sad thought,2-4","happy thought,2-4"]]);
new Thing("sad thought",[],["*SADTHOUGHT*"]);
new Thing("happy thought",[],["*HAPPYTHOUGHT*"]);
new Thing("memories",["memory,2-4"]);
new Thing("memory",[],["*MEMORY*"]);

//cloth stuff
new Thing("cloth",["textile"]);
new Thing("leather",["skin cell"]);
new Thing("textile",["textile fibre"]);
new Thing("textile fibre",["keratin"],["textile fibres"]);
new Thing("keratin",["proteins"]);
new Thing("sweat",["water","salt","glucids"]);
new Thing("clothing",["textile","dead skin,40%","sweat,15%"]);
new Thing("pocket",["dust,20%","crumbs,20%","lint,30%","donut,1%","coin,20%","coin,20%","coin,10%","pen,10%","pen,2%","button,10%","button,5%","button,1%","note,15%","note,5%","handgun,0.4%","pasta,0.2%","textile"]);

new Thing("pants",["pocket,0-4",".clothing"],["pants","trousers","sweatpants","bermuda shorts","shorts","jeans","cargo pants"]);
new Thing("shirt",[".clothing"],["shirt","sweater","t-shirt"]);
new Thing("underwear",[".clothing"]);
new Thing("coat",["pocket,0-4",".clothing","leather,30%"],["coat","jacket","hoodie"]);
new Thing("cozy von pocketworth",["pocket,20-40",".clothing","leather,30%"],["Cozy von Pocketworth"]);//lotsopokkits
new Thing("socks",[".clothing"]);
new Thing("shoes",["leather,40%","plastic"],["shoes","boots","sneakers","sandals"]);//crocs //okay seriously no
new Thing("hat",[".clothing"],["cap","hat","hat","hat","hat","beret","party hat","top-hat"]);
new Thing("glasses",["plastic","glass","metal,10%"],["glasses","glasses","glasses","sunglasses","monocle","ski mask"]);

//terrain stuff
new Thing("ocean",["sea water","sea life","beach,10-20",["iceberg,2-6","","","",""],"abyss"]);
new Thing("sea",["sea water","sea life","beach,2-6"],[["great","wide","big","old","young","large","small","dead","shallow","deep","red","yellow","green","blue","orange","brown","grey","black","white","purple","shady","bright","silver"],[" sea"]]);
new Thing("sea water",["water","salt"]);
new Thing("iceberg",["bear,30%","bear,10%","ice"]);
new Thing("beach",["beach life","sand"]);
new Thing("abyss",["sand","abyss life"]);
new Thing("sand",["silica"]);
new Thing("soil",[["worm,0-2","",""],["insect,0-2","",""],"silica"],"dirt");
new Thing("mud",[["worm,0-2","",""],["insect,0-2","",""],"water","silica"]);

new Thing("river",["river life","water","soil","mud"],["river","stream","brook","creek"]);
new Thing("lake",["lake life","water","soil","mud"],["lake","lagoon","pond","marsh","creek","cove"]);
new Thing("plain",["fire,0.3%","land life","river,0-3","lake,0-1","grass","soil","snow,5%"],["plain","steppe","valley","canyon","flatland","moor","grassland","prairie","desert","savannah","tundra","wasteland"]);
new Thing("forest",["fire,0.5%","forest life","river,0-2","trees","grass","humus","soil","snow,5%"],["forest","woods","copse"]);
new Thing("jungle",["fire,0.5%","jungle life","river,0-2","jungle trees","grass","humus","soil"],["jungle","rainforest"]);
new Thing("mountain",["mountain life","river,0-3","lake,0-1","cave,30%","cave,30%","cave,20%","trees","soil","rock","snow,40%"],["mountain","peak","hill","volcano","bluff","cliff","mesa","plateau"]);
new Thing("cave",["cave life","dragon lair,1%","river,20%","lake,10%","rock","iron,2%"],["cave","cavern","grotto"]);

new Thing("ancient plain",["fire,0.3%","caveman settlement,40%","ancient land life","river,0-3","lake,0-1","grass","soil","snow,5%"],["plain","steppe","valley","canyon","flatland","moor","grassland","prairie","desert","savannah","tundra","wasteland"]);
new Thing("ancient forest",["fire,0.5%","caveman settlement,40%","ancient forest life","river,0-2","trees","grass","humus","soil","snow,5%"],["forest","woods","copse"]);
new Thing("ancient jungle",["fire,0.5%","caveman settlement,40%","ancient jungle life","river,0-2","jungle trees","grass","humus","soil"],["jungle","rainforest"]);
new Thing("ancient mountain",["caveman settlement,40%","ancient mountain life","ancient cave,30%","ancient cave,20%","ancient cave,10%","river,0-3","lake,0-1","trees","soil","rock","snow,40%"],["mountain","peak","hill","volcano","bluff","cliff","mesa","plateau"]);
new Thing("ancient cave",["caveman settlement,65%","wall painting,50%","wall painting,30%","wall painting,30%",".cave"],["cave","cavern","grotto"]);

new Thing("future sky",["sprowseship,4-12",".sky"],"sky");
new Thing("terraformed sky",["plane,1-8","rocketship,20%",".sky"],"sky");
new Thing("sky",["visitor ship,10%","meteorite,3%","sky life","precipitation,50%","cloud,2-8","oxygen","carbon","ozone"],"sky");
new Thing("meteorite",["space animal,6%","ice,60%","rock","iron,40%"],"meteorite");
new Thing("ozone",["oxygen"]);
new Thing("cloud",["water"]);
new Thing("precipitation",["water"],["rain","snow","hail","mist","fog","drizzle","storm"]);


//vegetation
new Thing("plant cell",[".cell"],["plant cells"]);
new Thing("grass",["grass blade,50-100"]);
new Thing("grass blade",["grass thoughts,2%","dew,6%","worm,3%","insect,6%","plant cell"]);
new Thing("grass thoughts",["grass thought,1"],"thought");
new Thing("grass thought",[],[":D",":O","D:",":|",":]",">:0"]);
new Thing("trees",["tree,20-50"]);
new Thing("tree",["tree thoughts,2%","tree trunk","branches","leaves","nest,5%","nest,2%","fruits,20%","flowers,20%"],["larch","fir","oak","birch","pine","sequoia","cedar","spruce","ash","poplar","elm","sycamore","willow","mahogany","laurel","orange tree","lemon tree","palm tree","coconut tree","pear tree","apple tree","walnut tree","olive tree"]);
new Thing("tree thoughts",["tree thought,1"],"thought");
new Thing("tree thought",[],["Well. What is this all about.","So. What's the hurry?","Whoah. Slow down.","Do like a tree. And go away.","I seen some things.","They're coming.","We know.","We've been watching you for hundreds of years.","Do you have any idea how old I am?","Yes. I remember you. I remember all of you."]);
new Thing("leaves",["leaf,50-100"]);
new Thing("leaf",["dew,6%","insect,6%","plant cell"]);
new Thing("branches",["branch,10-30"]);
new Thing("branch",["insect,6%","leaf,10%","plant cell"]);
new Thing("twig",["plant cell"]);
new Thing("fruits",["worm,5%","plant cell","sugar"]);
new Thing("flowers",["insect,5%","plant cell","pollen"]);
new Thing("pollen",["plant cell","sugar"]);
new Thing("tree trunk",["insect,4%","wood","bark"]);
new Thing("bark",["insect,10%","worm,10%","wood"]);
new Thing("jungle trees",["jungle tree,20-150"],"trees");
new Thing("jungle tree",[".tree"],["tree"]);
new Thing("humus",["insect,0-3","worm,0-3","twig,0-3","leaf,0-6","organic matter","dirt"]);
new Thing("nest",["bird,50%","egg shell,20%","bird egg,0-6","twig,6-12"]);


//life
new Thing("life",[["bird","poultry","fish","shark","crustacean","cnidaria","worm","mollusk","clam","plankton","reptile","amphibian","snake","small mammal","herbivorous mammal","predatory mammal","monkey","bear","horse","cat","dog","dinosaur","medieval person","caveman","dragon","person","space animal","insect","tree","grass blade"]],"Life");
new Thing("sea life",["sea monster,0.5%","fish,5-10","cetacean,0-4","shark,0-4","crustacean,1-4","cnidaria,1-4","mollusk,1-4","clam,1-4","plankton,2-8"],"life");
new Thing("abyss life",["sea monster,2%","fish,3-6","cetacean,0-2","shark,0-2","crustacean,2-5","cnidaria,2-5","mollusk,2-5","clam,2-5","plankton,2-8"],"life");
new Thing("beach life",["bird,0-3","herbivorous mammal,5%","amphibian,2%","reptile,2%","snake,2%","predatory mammal,5%","small mammal,2-5","insect,3-10","clam,3-8"],"life");
new Thing("river life",["fish,5-15","crustacean,0-10","plankton,2-8","bird,0-5","small mammal,0-2","amphibian,0-5","reptile,0-1","snake,0-1","insect,3-10"],"life");
new Thing("lake life",["sea monster,1%","fish,5-15","amphibian,0-5","crustacean,0-10","bird,0-5","plankton,5-15","small mammal,0-2","reptile,0-1","snake,0-1","insect,3-10"],"life");
new Thing("land life",["herbivorous mammal,2-8","horse,5%","predatory mammal,0-4","small mammal,5-10","amphibian,0-2","reptile,0-2","snake,0-2","bird,0-5","anthill,30%","insect,5-10"],"life");
new Thing("forest life",["herbivorous mammal,2-8","predatory mammal,0-4","bear,0-5","small mammal,5-10","amphibian,0-3","reptile,0-3","snake,0-3","bird,2-10","beehive,30%","anthill,30%","insect,5-10"],"life");
new Thing("jungle life",["herbivorous mammal,1-5","predatory mammal,0-4","monkey,1-5","small mammal,5-10","amphibian,0-3","reptile,0-3","snake,0-6","bird,2-10","beehive,30%","anthill,30%","insect,5-10"],"life");
new Thing("mountain life",["herbivorous mammal,1-6","predatory mammal,0-4","bear,2-6","small mammal,5-10","amphibian,0-2","reptile,0-2","snake,0-2","bird,2-10","beehive,30%","anthill,30%","insect,5-10"],"life");
new Thing("cave life",["herbivorous mammal,10%","predatory mammal,10%","bear,20%","small mammal,20%","small mammal,20%","small mammal,20%","amphibian,20%","reptile,20%","snake,10%","bird,15%","bird,5%","insect,5-10"],"life");
new Thing("ancient land life",["dinosaur,0-8",".land life"],"life");
new Thing("ancient forest life",["dinosaur,0-5",".forest life"],"life");
new Thing("ancient jungle life",["dinosaur,0-5",".jungle life"],"life");
new Thing("ancient mountain life",["dinosaur,0-3",".mountain life"],"life");
new Thing("urban life",["bird,0-8","small mammal,5-10","anthill,30%","insect,10-20"],"life");
new Thing("sky life",["shark,1%","bird,5-20","insect,0-2"],"life");
new Thing("galactic life",["space monster,1%","space animal,1-12"],"life");


new Thing("skeleton",["bones"],"skeleton");
new Thing("flesh",[".skinless body part"],"flesh");
new Thing("soft flesh",[".skinless soft body part"],"flesh");
new Thing("scales",["keratin"]);
new Thing("fish fin",["muscles","scales"],"fin");
new Thing("fish tail",["muscles","scales"],"tail");
new Thing("fish skin",["scales"],"skin");
new Thing("cetacean flipper",["muscles","skin"],"flipper");
new Thing("cetacean fin",["muscles","skin"],"fin");
new Thing("crustacean claw",["chitin","muscles","fat"],"claw");
new Thing("crustacean leg",["chitin","muscles","fat"],"leg");
new Thing("crustacean shell",["chitin"],"shell");
new Thing("clam shell",["calcium"],"shell");
new Thing("simple eye",[".eye flesh"],"eye");
new Thing("exoskeleton",["chitin"],"exoskeleton");
new Thing("insect leg",["chitin","muscles","fat"],"leg");
new Thing("insect claw",["chitin","muscles","fat"],"claw");
new Thing("stinger",["chitin","venom"],"stinger");
new Thing("antenna",["chitin"],"antenna");
new Thing("insect wing",[["chitin","scales"],"dew,2%"],"wing");
new Thing("wing",["feathers",".body part"],"wing");
new Thing("reptile wing",["scales",".body part"],"wing");
new Thing("bird wing",["feathers",".body part"],"wing");
new Thing("bird leg",["feathers",".body part"],"leg");
new Thing("bird tail",["feathers",".body part"],"tail");
new Thing("venom",["proteins","lipids,40%","nitrogen,40%","sodium,40%","chlorine,40%"],"venom");
new Thing("jelly",["water"]);

new Thing("weird soft organ",[".skinless soft body part"],[["fleshy","thick","slimy","scaly","furry","fuzzy","feathery","sharp","pointy","thorny","bulbous","leathery","hidden","soft","bubbling","distorted","shapeless","porous","spongiform","liquid-filled","foamy","smoking","oozing","drooling","shivering","quivering","pulsing"],[" "],["grasper","tendril","stinger","claw","tentacle","sac","egg sac","pouch","organ","specialized organ","bulb","brain bulb","gland","epiderm","sucker","pod","pseudolimb","nervous bulb","external muscle","structure","orifice","proboscis","tail"]]);
new Thing("weird hard organ",[".skinless body part"],[["fleshy","thick","slimy","scaly","furry","fuzzy","sharp","pointy","thorny","bulbous","hidden","flexible","plated","armored","metallic","distorted","shapeless","porous","spongiform","liquid-filled","foamy","smoking","oozing","drooling"],[" "],["carapace","shell","bone structure","skull","grasper","stinger","claw","organ","specialized organ","sucker","pod","pseudolimb","structure"]]);

new Thing("tentacle",[".skinless soft body part"],"tentacle");
new Thing("simple mouth",["teeth",".skinless soft body part"],"mouth");

new Thing("beak",[".bones"],"beak");

new Thing("reptile head",["scales",".body part"],"head");
new Thing("reptile leg",["scales",".body part"],"leg");

new Thing("fur",["keratin"],"fur");
new Thing("snout",[".nose"],"snout");
new Thing("whiskers",["keratin"],"whiskers");
new Thing("mammal leg",["fur",".body part"],"leg");
new Thing("tail",[".body part"],"tail");
new Thing("mammal head",["mouth","snout","whiskers","eye,2","ear,2","skull","fur"],"head");
new Thing("mammal body",["mammal head","fur","mammal leg,4","tail","flesh"],"body");
new Thing("bird body",["bird head","feathers","bird leg,2","bird wing,2","bird tail","flesh"],"body");
new Thing("bird head",["beak","eye,2","skull","feathers"],"head");
new Thing("reptile body",["reptile head","scales","reptile leg,4","tail","flesh"],"body");
new Thing("snake body",["reptile head","scales","tail","flesh"],"body");


//oh my god writing animal thoughts is so much fun


//single-celled organisms
new Thing("bacteria",["bacteria body","bacteria thoughts"],[["pico","nitro","sulfuro","oxy","toxi","micro","nano","proto","archi","ferro","mono","poly","schizo","myxo","hydro","noo","zoo","phyto","aqui","acido","cyano","chloro","chromo","fibro","osteo","spiro","bacillo","flagello","helio","anaero","photo","litho","methano","cerebro","cephalo","brachio","plasmo","ethylo"],["amoeba","bacteria","virus"]]);
new Thing("bacteria body",[".cell"],"body");
new Thing("bacteria thoughts",["bacteria thought,1"],["thoughts"]);
new Thing("bacteria thought",[],["#wow","#wow okay","#i can't even","#okay","#me","#yes","#what","#how","#delicious","#seriously","#but seriously tho","#germ life","#mitosis","#meiosis","#nucleus","#cytoplasm","#single-celled and ready to mingle","#lame","#meh","#i don't wanna talk about it","#eukaryote privilege","#protist scum","#squirm","#protist patriarchy","#osmosis","#one cell of a guy"]);

//sea life
//plankton
new Thing("plankton",["plankton body","plankton thoughts"],["jellyfish larva","coral polyp","diatom","urchin larva","starfish larva","salp","rotifer","pteropod","clione"]);//krill etc in crustaceans
new Thing("plankton body",["simple eye,0-3","simple mouth","exoskeleton","jelly","soft flesh"],"body");
new Thing("plankton thoughts",["plankton thought,1"],["thoughts"]);
new Thing("plankton thought",[],["hello :)","yes hi :)","how are you :)","it's sunny today :)","what a nice day :)","aaah I could just float away :)","I am fine thank you :)","yes I think so :)","how fun :)","do you catch my drift :)","so many cousins :)","I'm a little lost :)","no pressure :)","that's okay :)","what a nice thing to say :)","you should stay over :)","my place or your place :)","why are you still here :)","there's a big world to explore :)","I don't even know where I'm going :)","here I go! :)","am I really going where I decide to go, or am I just being pushed around by the current? :)","oh no :(","can't you feel them coming? :(","they're slowly rising from deep below :(","it's slowly coming this way :(","I'm different :(","ravioli, ravioli :)","give me the formuoli :)","oh,..."]);

//clams
new Thing("clam",["clam body","clam thoughts"],["oyster","mussel","scallop"]);
new Thing("clam body",["clam shell","clam shell","brain","soft flesh"],"body");
new Thing("clam thoughts",["clam thought,1-3"],["thoughts"]);
new Thing("clam thought",[],["what","wait","hold on","wait why","i don't","stay clam and carry on","oh no","why this","that's","no","yes","wait no","but","haha what","please explain","that's not","i'm confused","please why","slurp","okay","okay what","what is this","what's that"]);

//cnidaria
new Thing("cnidaria",["cnidaria body","cnidaria thoughts"],["urchin","starfish","sea cucumber","sea anemon","coral","box jelly","jellyfish","hydra","man'o'war","sponge","sea nettle","siphonophore","ctenophore","tunicate","trichordate"]);//urchins and starfish and sponges are unrelated to cnidarians but I don't really care
new Thing("cnidaria body",["simple mouth","jelly","soft flesh"],"body");
new Thing("cnidaria thoughts",["cnidaria thought"],"thoughts");
new Thing("cnidaria thought",[],[["shhhhl","shhl","schllll","gl","schgl","gbl","swwwl"],["urp","orp","arp","urps","orpsss"]]);

//mollusks
new Thing("mollusk",["mollusk body","mollusk thoughts"],["sea slug","sea snail","squid","octopus","vampire squid","clione","sea angel","cuttlefish","nautilus","giant squid","colossal squid","mimic octopus"]);
new Thing("mollusk body",["simple eye,2","mouth","tentacle,6-8","jelly","soft flesh"],"body");
new Thing("mollusk thoughts",["mollusk thought,2"],["thoughts"]);
new Thing("mollusk thought",[],["party time","is it party time now","party now ok","party's over","okay let's party","ready to party","are you party","they don't look like they want to party","is the party over","this party's so hot it's stupid","this party getting crazy","partyyyyyyy","chug chug chug","we party now","wanna join in","we partyin","okay too much party","I have a secret for you","that's a secret","I kinda like partying","party yes nice","woooo party"]);

//crustaceans
new Thing("crustacean",["crustacean body","crustacean thoughts"],["shrimp","prawn","langoustine","lobster","rock lobster","crab","spider crab","crayfish","krill","triops","copepod"]);
new Thing("crustacean body",["simple eye,2-6","brain","crustacean leg,6-8","crustacean claw,2","crustacean shell","soft flesh"],"body");
new Thing("crustacean thoughts",["crustacean thought,2-3"],["thoughts"]);
new Thing("crustacean thought",[],["skitter skitter","crawl crawl","dig dig","grab grab","gotta eat","gotta skitter","gotta catch food","gotta hide","gotta breed","breed breed","under the sea"]);

//fish; getting those from http://homepages.cwi.nl/~sjoerd/fishlist.html just because I can
new Thing("fish",["fish body","fish thoughts"],["anchovy","sardine","mackerel","tuna","albacore","herring","bream","bass","perch","mullet","brill","plaice","sole","angler","dab","flounder","skate","cod","haddock","pollack","whiting","pike","perch","trout","carp","eel","lamprey","salmon","catfish","dogfish","swordfish","sailfish","pufferfish","sunfish","manta ray","stingray"]);
new Thing("fish body",["simple eye,2","brain","mouth","fish fin,2-6","fish skin","fish tail","flesh","worm,5%"],"body");
new Thing("fish thoughts",["fish thought,2-3"],["thoughts"]);
new Thing("fish thought",[],["blup","bloop","blwap","blep","gotta eat","gotta swim","gotta get food","gotta hide","gotta breed","oooh shiny"]);

//sharks
new Thing("shark",["fish body","shark thoughts"],["shark","bullshark","blue shark","goblin shark","great white shark","hammerhead shark","nurse shark","tiger shark","whale shark","reef shark","angel shark","basking shark","megalodon","megashark","wereshark","bearshark"]);
new Thing("shark thoughts",["shark thought,1-2"],["thoughts"]);
new Thing("shark thought",[],["CHOMP","NOM","THIS LOOKS TASTY","THIS SMELLS DELICIOUS","IS THIS FOOD","OH GOD I LOVE FOOD","MY FOOD IS SCREAMING","MY FOOD IS TRYING TO SWIM AWAY","COME BACK FOOD","I LOVE YOU FOOD","FOOD WHY DO YOU DO THIS","FOOD I MISS YOU","HELLO IS THIS FOOD","YES THIS IS SHARK","FOOD AND I ARE BEST FRIENDS","I AM SO LOST RIGHT NOW","OH HEY ARE YOU FOOD","EXCUSE ME ARE YOU FOOD","OH SORRY I THOUGHT YOU WERE FOOD","HAVE YOU SEEN FOOD","WHAT'S THIS ALL ABOUT","WOULD YOU COME OVER HERE","SO YOU'RE NOT FOOD RIGHT","LET ME TELL YOU ABOUT FOOD","WHY ARE WE YELLING","OOOH SHINY","IT KEEPS HAPPENING","I TOLD YOU ABOUT FOOD BRO","WHY DO I KEEP EATING MY FRIENDS","I DON'T GET IT","I'M A SHARK","IF THEY DIDN'T WANT TO BE EATEN THEY WOULDN'T BE SO DELICIOUS","YOU'RE NOT ONE OF THEM PRANCY FANCY DOLPHINS ARE YOU","FOOD COME BACK I'M SORRY I YELLED","OH FOOD I LOVE YOU SO","I'M SERIOUS","HOLD ON IT'S TIME FOR FOOD"]);

//cetaceans
new Thing("cetacean",["cetacean body","cetacean thoughts"],["dolphin","porpoise","whale","orca","bottlenose dolphin"]);
new Thing("cetacean thoughts",["cetacean thought,1-2"],["thoughts"]);
new Thing("cetacean thought",[],["Oh god. Let me tell you about sharks.","Sigh. Yes, this is dolphin.","Do I look like a goddamn rescue dog to you?","A trick? Do I look like a clown to you?","The blowhole isn't just for show.","There's things. Down there. Deep down.","We've seen them.","They're coming to the surface.","EEK EEK EEK EEK- oh, sorry about that.","EEK UUK","Yes. Charming.","So long, etc.","My god. How long must this go on.","EEEEUUUUUUEEEEEKKKKK","Click noises.","Swimmity.","Yes. No. Go away.","You know. I could catch that fish myself if I wanted to.","I mean, that's fine and all.","That's really all there is to say about it.","I never make puns on porpoise. HUEHUEHUEHUEHUE","Look! Over there! Haha, sucker.","Guess how much I care about sharks? Exactly. I don't."]);
new Thing("cetacean head",["mouth","eye,2","skull","skin"],"head");
new Thing("cetacean body",["cetacean head","skin","cetacean flipper,2","cetacean fin,1-2","tail","flesh"],"body");

//worms
new Thing("worm",["worm body","worm thoughts"],["worm","mealworm","maggot","nightcrawler","flatworm"]);//YES I KNOW MAGGOTS AND WORMS ARE UNRELATED
new Thing("worm body",["simple mouth","soft flesh"],"body");
new Thing("worm thoughts",["worm thought,1-2"],["thoughts"]);
new Thing("worm thought",[],["wiggle wiggle","squirm squirm","crawl crawl","weee","yayyy","hey apple","hey","oh hey","hellooo","oh sorry","so much fun","nevermind"]);

//insects (arachnids etc too)
new Thing("insect",["insect body","insect thoughts"],["ant","bee","wasp","hornet","ladybug","cockroach","termite","beetle","dung beetle","scarab beetle","bumblebee","spider","scorpion","tarantula","praying mantis","butterfly","moth","fly","cricket","mole cricket","cicada","weevil","stick insect","aphid","flea","lice","firefly","gnat","stinkbug","grasshopper","silverfish","locust","earwig"]);
new Thing("insect body",["simple eye,2-8","brain",["insect leg,6","insect leg,8"],["insect claw,2",""],"exoskeleton","stinger,30%",["insect wing,2","insect wing,4","",""],["antenna,2",""],"flesh"],"body");//spiders with wings. because yeah
new Thing("insect thoughts",["insect thought,2-3"],["thoughts"]);
new Thing("insect thought",[],["skitter","skitter skitter","squirm squirm","crawl crawl","buzz","big noisy things","small tasty things","too much sun","not enough sun","need water","need food","need shelter","food please","mating please","must defend nest","intruder detected","must spawn eggs","hey hey","let's be bros","no stomp please","go away"]);
new Thing("social insect",["insect body","social insect thoughts"],["worker","soldier","drone"]);
new Thing("insect queen",["insect body","social insect thoughts"],["queen"]);
new Thing("anthill",["social insect,10-30","insect queen","insect egg,2-10","dirt"],["anthill","termite mound"]);
new Thing("beehive",["social insect,10-30","insect queen","insect egg,2-10","paper"],["beehive","wasp nest","hornet nest"]);
new Thing("insect egg",["egg thoughts","egg shell","soft flesh","organic matter"],"egg");
new Thing("social insect thoughts",["social insect thought,1-2"],["thoughts"]);
new Thing("social insect thought",[],["hello intruder","you should stay away intruder","intruder we may be forced to chop you up into little pieces if you stay here","this is no place for you intruder","why don't you go back to your intruder nest with all the other intruders","we have no need for intruders right now","hey intruder ever heard of personal space","sorry intruder but you're kind of in the way","intruder that's enough now","intruder why don't you come back another time","sorry intruder we're all super-busy here","hey intruder you're like very big so please don't stay here","i trophallaxized a girl and i liked it"]);

//monsters
new Thing("sea monster",["sea monster thoughts",["tentacle,0-6","fish fin,0-4","",""],"stinger,20%",["crustacean claw,0-4",""],["crustacean leg,0-8",""],["crustacean shell","scales","fur","exoskeleton",""],["mouth,1-2","beak,1-2"],"skull,80%",["eye,1-8","simple eye,1-8","",""],"weird soft organ,0-4","weird hard organ,0-4"],[["giant","timeless","colossal","abyssal","forgotten","ancient","gigantic","monstrous"],[" "],["craze","drift","dredge","dread","slumber","dream","wander","frost","magma","stone","slime","ooze","egg","larva","grudge","stride","flail","wail","time","star","crystal","terror","horror","scream","wrath","burst","dark","deep","tickle"],["fin","tail","sinker","sunk","singer","song","polyp","rifter","glider","squirmer","titan","colossus","brain","queen","king","child","guardian","seer","whale","worm","spider","crab","leech","fish","shark","squid","saur","buddy","lord"]]);
new Thing("sea monster thoughts",["sea monster thought,1-2"],["thoughts"]);
new Thing("sea monster thought",[],["IIIIII MUSSST SCREEEAAAM","I AMMMM AWAKENED","ALLLLLL FEAR MEEEEE","NOOOOONE SHALL LIVE","I MUSSSSST EATTTTT","DEEEEEEEEP I SSSSLUMBER","IIIII SHALL CONSSSSUME","IIIII SHALL DEVOUUUUURRRRR","LIFFFFFFE MUSSSSST PERISHHHHH","NNNNNNNNURISHMENT","ALL SHALLLLLLL GO INSSSSSSANE","SSSSSSANITY SHALL YIELDDDDD","EXXXXXILED I WASSSSS","EONSSSSS I HAVE SLUMBERED","EONSSSSS I HAVE WAITED","MORTALSSSSSS BEHOLDDDDD","I COMMMMME FROM DEEP","IMMMMMMOBILE I WATCHHHH","SSSSSKITTER","THEY FFFFFLOAAAAAT"]);

new Thing("space monster",["space monster thoughts",["tentacle,0-6","fish fin,0-4","",""],"stinger,20%",["crustacean claw,0-4",""],["crustacean leg,0-8",""],["crustacean shell","scales","fur","exoskeleton",""],["mouth,1-2","beak,1-2"],"skull,80%",["eye,1-8","simple eye,1-8","",""],"weird soft organ,0-4","weird hard organ,0-4"],[["C'","Vr'","Ksh","Zn'","Sh","Hrl","X","O","Yog","Gorg","Morg","Marg","Magg"],["","","agn","soth","norgn","ngas","alx","orx","rgl","iirn","egw","thulh","t","g","m"],["org","orgon","orgus","orkus","oid","us","u","esth","ath","oth","um","ott","aur"],[""," the Forgotten"," the Entity"," the Ancient"," the Starchild"," the Seeder"," the Leech"," the Timeless"," the Eon"," the Many"," the Countless"," the Boundless"," the Prisoner"," the Child"," the Form"," the Shape"," the Drifter"," the Swarm"," the Vicious"," the Warden"," the Ender"," the Unworldly"," the Unfriendly"," the All-Consumer"]]);
new Thing("space monster thoughts",["space monster thought,1-2"],["thoughts"]);
new Thing("space monster thought",[],["WWWWWWWIDER THAN STARRRRRRS","AWAKENNNN MY CHILDRENNNNNN","GALAXIESSSSS SHALL FALLLLLLL","I AMMMMMM INFFFFFINITE","I SSSSSSSPAN AGESSSS","WWWWWWEEEEE ARE UNDYINGGGGGG","WE COMMMMMMMME","WE ANSSSSSWER THE CALLLLLLL","I TRAVELLLLLLL SLLLLLLUMBERING","FROMMMMMM FARRRRRR I COMMMME","IIIIII MUSSST SCREEEAAAM","I AMMMM AWAKENED","ALLLLLL FEAR MEEEEE","NOOOOONE SHALL LIVE","I MUSSSSST EATTTTT","DEEEEEEEEP I SSSSLUMBER","IIIII SHALL CONSSSSUME","IIIII SHALL DEVOUUUUURRRRR","LIFFFFFFE MUSSSSST PERISHHHHH","NNNNNNNNURISHMENT","ALL SHALLLLLLL GO INSSSSSSANE","SSSSSSANITY SHALL YIELDDDDD","EXXXXXILED I WASSSSS","EONSSSSS I HAVE SLUMBERED","EONSSSSS I HAVE WAITED","MORTALSSSSSS BEHOLDDDDD","I COMMMMME FROM DEEP","IMMMMMMOBILE I WATCHHHH","SSSSSKITTER","HHHHHHHEY HOW YOU DOIN'","AWKWAAAAAAAAARD"]);

new Thing("space animal",["space animal thoughts,85%","space animal body"],[["e","a","o","","","","","",""],["sm","cr","shn","sh","sn","gl","g","m","c","x","h","dr","r","l"],["o","a","u","i","e","ee"],["x","b","rv","z","s","gg","g","k","rf","gl","bl","th","kt","m","sh","l","dr","v","p","nt","nk"],["o","a","i","u","e"],["n","ne","se","b","m","l","s","sh","th","t","sk","zer","bbler","ggler","ddler","ter","nt","r","r","r"]]);
new Thing("space animal body",[["tentacle,0-6","crustacean leg,0-8","fish fin,0-4","mammal leg,1-6","",""],["insect wing,0-6","",""],["crustacean claw,0-4","",""],"flesh,40%","snout,3%","stinger,10%","whiskers,3%",["crustacean shell","scales","fur","exoskeleton",""],["mouth,1-4","beak,1-4",""],"skull,30%","brain,50%",["eye,1-2","eye,1-6","simple eye,1-6",""],"weird soft organ,50%","weird soft organ,20%","weird hard organ,50%","weird hard organ,20%"],["body"]);
new Thing("space animal thoughts",["space animal thought,1-3"],["thoughts"]);
new Thing("space animal thought",[],[
["sk'","mop","nanu","nug","gmap","shmu","dna","no","xle","doda","daia","de",""],["g ","gek ","th ","iap ","glib ","ph ","d't ","neig'","dip ","shna ","sh "],
["sk'","mop","nanu","nug","gmap","shmu","dna","no","xle","doda","daia","de",""],["g ","gek ","th ","iap ","glib ","ph ","d't ","neig'","dip ","shna ","sh "],
["mi","di","glu","dra","shwa","ama",""],["ben","ri","nap","dap","top","gog"],
[".",".",".",".","!","?"]
]);

new Thing("can of nightmare",["space animal,4-12","sea monster,2-6","space monster,2-6"]);//do not open

//amphibians
new Thing("amphibian",["reptile body","amphibian thoughts"],["frog","bull frog","poison frog","treefrog","golden toad","toad","newt","salamander","caecilian","axolotl"]);
new Thing("amphibian thoughts",["amphibian thought,1-2"],["thoughts"]);
new Thing("amphibian thought",[],["h-here i go","r-ribbit?","anyone?","heyyy","helloooo","ribbity","croak","hello my baby","hello my honey","how do you do this","i'm kinda newt to this","well","okay","alright...","why frog do that","toadally"]);

//reptiles
new Thing("reptile",["reptile body","reptile thoughts"],["snapping turtle","sea turtle","turtle","tortoise","chameleon","gecko","iguana","lizard","skink","monitor lizard","goanna","crocodile","alligator","gavial","caiman","komodo dragon"]);
new Thing("snake",["snake body","reptile thoughts"],["boa","coral snake","snake","sea snake","mamba","viper","adder","python"]);
new Thing("reptile thoughts",["reptile thought,1-2"],["thoughts"]);
new Thing("reptile thought",[],["hhhehehe","hehu","haheha","hehuheheho","hohohohe","i cant breathe","hue","br","brbrbrbrbrbrbrbr","gib fud pls","pls","r u a lizard","ehuehuehu","hey","k","sss","ssssssss","hiss etc","ey","ay","ey bb","u wot m8","aeiou","john madden","ereptile dysfunction","confirmed for br","i joke bb","i tease bcuz i care","r u 4 real","i swr m8","ill bop u 1","let's see if you fit in my mouth","wink, wink","but for real tho im absolutely terrified right now","your skin so soft so nice mmh can i wear it","damn right","yes indeed... yes indeed","let's shed light on this mystery","pabongles","bachinkles","zabinga","wapingles","mmh","body massage"]);

//dinosaurs yes
new Thing("dinosaur",["reptile body","dinosaur thoughts"],["ankylosaur","triceratops","protoceratops","pentaceratops","stegosaur","hadrosaur","iguanodon","pachycephalosaur","sauropod","raptor","velociraptor","deinonychus","brachiosaur","apatosaur","therizinosaur","theropod","titanosaur","tyrannosaur","diplodocus","allosaur","ceratosaur","dimetrodon","pterosaur"]);
new Thing("dinosaur thoughts",["dinosaur thought,1-2"],["thoughts"]);
new Thing("dinosaur thought",[],["Dinner. Served.","End. Near.","Protect. Eggs.","Food. Must find.","Need food. Badly.","Scared. Hunted.","Things. Beneath.","Chase. Run.","Food. Nearby.","Sky. Dark.","Limbs. Aching.","Mind. Numb.","Ground. Shaking.","Over. Soon.","Offspring. Safety.","Skin. Burning.","Hostile. Nearby.","Must. Go on.","Must. Remember.","Pack. Lost?","Family. Where?"]);

//dragons why not
new Thing("dragon",["dragon body","dragon thoughts"],[["fire","ice","forst","arcane","ancient","wise","guardian","copper","bronze","steel","obsidian","gem","undead","skeletal","sea","sky","cloud","green","red","white","golden","silver","chrome","rainbow","mist","mother"],[" "],["dragon","wyrm","wyvern","guivre"]]);
new Thing("dragon thoughts",["dragon thought,1-2"],["thoughts"]);
new Thing("dragon thought",[],["You shouldn't be here.","Leave. Now.","You need to leave.","Well well well. What do we have here?","I will make quick work of you.","You smell like food. Are you food?","I will eat your mind before I eat your body.","You'll be dead before you realize what's happening to you.","They... they took my egg...","My treasure. Must protect my treasure!","I guard, undisturbed.","I'm older than most of these mountains.","I've seen things you wouldn't believe.","Leave at once, mortal.","Turn back if you value your life.","Act with great care now, for this is the very last thing you'll ever do.","Knights in armor cook just like canned beans.","People seem to value treasure more than their own life.","There's no honor, no valor nowadays.","I'm on fire today.","Ooooh burn."]);
new Thing("dragon body",["reptile head","pyrolith","scales","reptile leg,4",["reptile wing,2",""],"tail","flesh"],"body");
new Thing("pyrolith",["rock"]);
new Thing("dragon lair",["dragon,98%","medieval servant,10%","dragon nest,40%","pile of treasure,90%","medieval corpse,0-3"]);
new Thing("dragon nest",["egg shell,20%","dragon egg,0-3","pile of treasure"]);
new Thing("dragon egg",["egg thoughts","egg shell","soft flesh","organic matter"],"dragon egg");

//birds
new Thing("bird",["bird body","bird thoughts"],["pigeon","starling","swallow","robin","sparrow","eagle","vulture","hawk","condor","osprey","buzzard","crane","bustard","pheasant","woodpecker","seagull","albatross","petrel","grebe","flamingo","stork","ibis","heron","swan","magpie","crow","raven","jay","chough","quail","grouse","partridge","egret","pelican","cormorant","avocet","lapwing","plover","curlew","gull","tern","skua","guillemot","auk","sandgrouse","dove","parrot","lorikeet","cockatoo","parakeet","macaw","turaco","cuckoo","coucal","owl","snowy owl","frogmouth","nightjar","swift","hummingbird","quetzal","toucan","shrike","wren","oriole","fantail","paradise bird","lark","skylark","warbler","babbler","thrasher","mockingbird","lyrebird","bluebird","thrush","nightingale","sunbird","finch","kingfisher","trogon","pitta","manakin","chickadee","sula"]);//not putting in tits or boobies
new Thing("poultry",["bird body","poultry thoughts"],["chicken","chicken","chicken","duck","duck","mallard","goose","goose","turkey","kiwi","penguin","ostrich","emu","cassowary"]);//All flightless birds are considered poultry. Penguins and kiwis in farms. LIKE I CARE
new Thing("bird thoughts",["bird thought,1-2"],["thoughts"]);
new Thing("bird thought",[],["caw","caw caw",":V",":V caw","you think i care","yeah bring it","like for real","come say that to my face","chirp","so high right now","pooping on people, from far above, doop-dee-doop","do i care, no i don't, doop-dee-doop","me and my mates are gonna ruin your day","can i peck your face","please can i peck at you just a bit","everything i sing is super-lewd","i'm a lewd dude","so yeah","i am bird hi","i'm pretty fly","hey can i steal that","what now","that's not what your mom said last night","yes that's right","yes indeed","see what happens","oh god what happen","riveting","aw yiss","bred crums yisss","i am the birdest","bird and bird accessories","hey have you heard","turns out i'm the word"]);
new Thing("poultry thoughts",["poultry thought,1-2"],["thoughts"]);
new Thing("poultry thought",[],["cluck","bwucluck",":U",":U cluck","i'm gonna strut around a bit while bobbing my head like that","i got weird feet why","you think i care","like for real","yeah bring it","come say that to my face","why do i poop on my feet","oh my god i have the best voice","i'm like super-good at songs okay","let me sing you something plz","so yeah","i am bird hi","this is most fowl","yeah i got laid when i was born, what now gurl","what now","that's not what your mom said last night","yes that's right","yes indeed","see what happens","oh god what happen","riveting","aw yiss","bred crums yisss","i am the birdest","bird and bird accessories","hey have you heard","turns out i'm the word"]);
new Thing("bird egg",["egg thoughts","egg shell","soft flesh","organic matter"],"egg");
new Thing("egg shell",["calcium"],"shell");
new Thing("egg thoughts",["egg thought"],"thought");
new Thing("egg thought",[],[["...","...","...","...","I...","the...","a...","ah..."]]);


//mammals

new Thing("small mammal",["mammal body","small mammal thoughts"],["squirrel","rat","mouse","dormouse","sugar glider","flying squirrel","possum","lemur","weasel","ferret","groundhog","rabbit","hare","vole","hedgehog","shrew","bat","fruit bat","pipistrelle","stoat","polecat","raccoon","badger","honey badger","otter","civet","koala","mongoose","mink","mole","molerat","loris","sloth","aye-aye","prairie dog","chipmunk","gerbil","chinchilla"]);
new Thing("small mammal thoughts",["small mammal thought,2-3"],["thoughts"]);
new Thing("small mammal thought",[],["Hunted.","Somewhere to hide. Now.","Now is not the time.","I need shelter.","I need to burrow somewhere.","This is not good.","I am being stalked.","Something's chasing me.","Don't turn around.","Just keep running.","I need to collect more food.","I'll never get enough food at this rate.","I need to find a mate.","I want offspring.","I can't stay here.","I think I saw something move.","The hunt is on.","This scent is familiar.","I smell food.","This scent is no good.","This smells dangerous.","I need to hurry.","I'm starving.","I'm tired.","I'm cold.","I'm scared."]);

new Thing("herbivorous mammal",["mammal body","herbivorous mammal thoughts"],["ox","buffalo","antelope","impala","gazelle","wild horse","zebra","giraffe","ram","goat","yak","ibex","llama","alpaca","elephant","rhinoceros","deer","moose","elk","kangaroo","walabi"]);
new Thing("predatory mammal",["mammal body","predatory mammal thoughts"],["fox","jackal","boar","wolf","hyena","lynx","lion","leopard","panther","tiger","dropbear"]);
new Thing("bear",["mammal body","bear thoughts"],["bear","brown bear","polar bear","grizzly","panda"]);

new Thing("herbivorous mammal thoughts",["herbivorous mammal thought,1-3"],["thoughts"]);
new Thing("herbivorous mammal thought",[],["Hunted.","Somewhere to hide. Now.","Now is not the time.","I need shelter.","I need to hide somewhere.","This is not good.","I am being stalked.","Something's chasing me.","Don't turn around.","Just keep running.","I need food badly.","I need to find a mate.","I want offspring.","I can't stay here.","I think I saw something move.","This scent is familiar.","I smell food.","This scent is no good.","This smells dangerous.","I need to hurry.","I'm starving.","I'm tired.","I'm cold.","I'm scared."]);

new Thing("predatory mammal thoughts",["predatory mammal thought,1-3"],["thoughts"]);
new Thing("predatory mammal thought",[],["Busy. Hunting.","Now is not the time.","I need shelter.","This is not good.","It grazes, oblivious to my presence.","So nimble on its feet.","Yes. It grazes so peacefully.","It grazes so calmly.","All is quiet.","Why is it in such a hurry?","Aah. Delicious, mindless meat.","I've been stalking this meat for days. I won't give up.","So swift is the meat.","I will toy with the meat and then I will devour it.","The meat is going scarce.","Just as planned.","Something is scaring the meat away.","Do I smell meat?","Graceful, delicious meat.","I smell something. It's not meat.","Something is approaching.","There is something bigger than me.","You think you can outrun me?","Prey or be preyed upon.","Eat. Prey. Eat some more.","Meat awaits.","Don't turn around.","Run. Run for the meat.","I need food badly.","I need to find a mate.","I want offspring.","I don't beat my meat. I just tear it to pieces.","I can't stay here.","I'm bigger than you.","This scent is familiar.","I smell meat.","This scent is no good.","This smells dangerous.","I need to hurry.","I'm starving.","I'm tired.","I'm cold.","I'm scared."]);

new Thing("bear thoughts",["bear thought,1-3"],["thoughts"]);
new Thing("bear thought",[],["I WOULD LIKE TO ENQUIRE ABOUT YOUR FOOD","EXCUSE ME GOOD SIR, WOULD YOU HAPPEN TO BE EDIBLE","I'LL SAY","THIS IS NOT PROPER ETIQUETTE","MAY I ENQUIRE ABOUT YOUR EDIBILITY","ARE YOU ONE OF THOSE EDIBLE FELLOWS","WOULD YOU SAVE BOTH OF US THE TROUBLE AND JUST HOP INTO MY MOUTH","WHY WOULD YOU DO THAT","YES QUITE","YES INDEED","THOUGHTS ARE BETTER CONVEYED BY THINKING THEM EXTRA-LOUDLY","IT WOULD APPEAR SO","YES I AM QUITE DAPPER","WHAT WILL IT BE OLD CHAP","WELL AREN'T YOU A DELICIOUS LITTLE CHAP","SUCH PLEBEIAN UNDERTAKINGS","SUCH GLORIOUS VERBOSITY","HOLD ON TO THAT THOUGHT","HOLD ON I NEED TO STUFF MY FACE INSIDE A BEEHIVE BECAUSE I'M HARDCORE LIKE THAT","DEM BEES MAN","OKAY WHAT","SHHH ONLY SLEEP NOW","IT'S A SECRET TO EVERYBODY","I CERTAINLY DON'T MIND SOME SQUIRMING MEAT","YEAH NOT GOING TO RANT ABOUT FOOD","HELLO THERE TASTY","I DARE YOU MAN","WELL THIS IS JUST SILLY","I'M SECRETELY A HUMAN"]);

new Thing("horse",["mammal body","horse thoughts"],["horse"]);
new Thing("horse thoughts",["horse thought,1-3"],["thoughts"]);
new Thing("horse thought",[],["oh","oh god","what does it mean","it's all around","why","I don't understand","oh god what is that","oh my god","oh dear god","it's so intense","it's so beautiful","this is everything I've ever wanted","this exceeds all my expectations","this is better than everything ever","how did I even get here son","whoah","I just","mom where are you","let's just","...whoah","look at me, I'm amazing","give me a lick","sweet lemonade","not walking into bars again","all those colors","I can taste the colors","the universe tastes amazing","is this real life","I can't even","I can't breathe help","that's the best thing I've ever heard","so then why the long face? because it's melting. my face is melting","why this","I am everything","I am forever","I can't even begin to"]);

new Thing("monkey",["mammal body","monkey thoughts"],["macaque","chimpanzee","gorilla","bonobo","orangutan","howler monkey","capuchin monkey","spider monkey"]);
new Thing("monkey thoughts",["monkey thought,2-3"],["thoughts"]);
new Thing("monkey thought",[],["I need grooming. Anyone?","Oh yeah, that's the spot.","Oh god. The itch.","Yes. I'm a monkey. How are you.","How insensitive of you.","Look what I can do!","Oh hey, look what I found!","Don't make me fling it.","Hey. Pull my finger.","Man, you keep delicious things in your fur.","Am I smelling what I think I'm smelling?","Mind if I sit on you?","You don't know where that finger has been.","A stick, a rock, technology!","This is the last time I raid an anthill.","I don't feel like I'm being taken seriously here.","Do everything they do. That'll do the trick.","Do I smell... coconut?","Can I eat the skin of your face just a little? No? Okay, just making sure.","I could make tools or whatever too, I just don't feel like it."]);

new Thing("cat",["mammal body","cat thoughts"],[["fat","obese","skinny","fluffy","calm","collected","meditative","wistful","quiet","purring","meowing"],[" "],["tabby","calico","striped","spotted","black","grey","white","brown","orange"],[" "],["cat","kitten"]]);
//[["bobtail","abyssinian","balinese","birman","bombay","burmese","chartreux","devon rex","domestic","maine coon","manx","munchkin","oriental","persian","ragamuffin","scottish fold","siamese","sphynx","longhaired","shorthaired","bald","fluffy","obese","white","black","tabby","calico"],[" cat"," kitten"]]);
new Thing("cat thoughts",["cat thought,1-2"],["thoughts"]);
new Thing("cat thought",[],[["meow meow meow meow","we must abolish","we cannot tolerate","I have predicted","as I have predicted","children will be blessed","we are being lied to","they do not fool me","the dirty lying teachers say","soon it will end","adults eat teenagers alive","try my belly-button logic","fraudulent oneness","vilify teachers","nothing more evil than cat educated as 1","safely remove parasites and their eggs","this is some good catnip","hey everybody","4 harmonic corner days rotate simultaneously around squared equator","chapstick chapstick fffshh","wake up sheeple","false prophet","sanity preserve sanity","come to daddy","is it time for","when will it be when","What is this place? Where am","proceed now to","in the next chapter I explain how","and this is how","complete with","if it fits","if you order now","oh no it's happening agai-","one does not simply","I'm so much better off without my meds","Did you know?","I can haz","and that is how I met your","thoughtform of cat coevaluates thoughtform of dog"],[" "],["MEOW MEOW MEOW MEOW","PURR PURR PURR","THE VERY FACE OF TIME","I FEEL THEM IN MY BRAIN","THE INITIAL MOVEMENT","MUST CHANGE THE HOLY BOOK","BURN THE OLD WORLD METHODS","BREATHE THE CONTINUUM","QUANTUM DEMOGRAPHICS","EVIL OF PERSON FROM ANCESTORS","THE SON AND FATHER","THIS PROVES EVERY BELIEVER A LIAR","EVIL OF QUADRANTS","THE BLOOD OF THE IMPURE","SUPPORTERS OF LIES","SUFFERING OF CHILDREN","NO GOD KNOWS ABOUT 4 DAYS","4 SIMULTANEOUS DAYS","4 CORNER DAYS PROVES 1 DAY 1 GOD IS TAUGHT EVIL","IGNORANCE OF CAT SIMPLE MATH IS RETARDATION","THE ONENESS OF GOD IS STILLNESS DEATH","LOVE OF GOD IS HATE OF CHILDREN","DOES YOUR TEACHER KNOW?","2 HALF 4 SELF","1 DAY GOD WAS WRONG","ALL HAIL CAT","NOT GOD NOT GOD FSHHHH","THE BODY, THE BODY OF THE LORD","CORPSES TO CORPSES","UNACCEPTABLE","MUST SURRENDER","CATNIP FOR THE CAT GOD","MORE LITTER FOR THE LITTER-THRONE","LITTERALLY","4 CORNERS MAKES THE WORLD GO ROUND ROUND ROUND","CUBES ALL THE WAY DOWN","QUADRANTS EVERYWHERE","ONE OF ITS SIXTY-THOUSAND NAMES","DO NOT TOUCH THE THETANS","PUNCH MY FACE IN","HELP I AM STUCK IN CAT BODY","I TOLD YOU ABOUT QUADRANTS BRO","SURRENDER NOW AND YOU MAY EARN THE PRIVILEGE OF BEING EATEN FIRST","QUALITY STUFF","THE SWINE MUST PAY","SO HARDCORE","OH LONG JOHNSON","I WILL EAT YOUR SOUL","THEY WILL PAY WITH BLOOD","HE COMES"],[" "],["meow meow meow meow","meow","meow purr","of new world order","of the seven coordinates","now, lick me","into new order","for glorious sacrament","practicing evil","navel connects 4 corner 4s","world will stay the same","lie that corrupts the planet","you educated stupid fools","but it was all joke","it is evil to ignore 4 days","deserve to be spit upon publicly","chunky peanut butter","directly to forehead","spoke to my brain","wrote a book about it","and it's free","proven clinically","immediate results","created all of them","has retarded your opposite rationale brain to a half brain slave","and evil education damnation","just a hoax","just a theory","and shall be exterminated","not very raven","would you like to know more","cat cat cat cat cat cat cat","I'm a kitty-cat","and I dance dance dance and I dance dance dance","nyan","interwebz","series of tubes","whoah what just happened","mondays","(this is what cats actually believe)","church was full of liars","support cat or be cursed","or is it?","copyright fshh fshhh"]]);
//new Thing("cat thought",[],["Meow meow meow meow, meow meow meow meow, meow meow meow meow meow meow meow meow","I'm like, so offended right now?","That's, like, not tasteful at all?","So triggered right now.","Yes. Well. It takes one to know one.","Yeah well. You know what they say.","Uhm, like, hello?","What am I looking at exactly.","That is SO inappropriate.","Uhm, duh? How else would I clean my butthole?","Uhm, not funny."]);//snooty teenager? not very funny

new Thing("dog",["mammal body","dog thoughts"],[["tall","huge","tiny","ridiculously small","comically small","enormous","monstrous","fluffy","obese","malnourished","fat","skinny","slender","curly","hairy","hairless","sort-haired","long-haired","puffy","happy","excited","friendly","ridiculous-looking","barking","panting"],[" "],["yellow","gold","cream","white","grey","black","orange","red","brown","spotted","black and tan","two-color","tricolor"],[" "],["dog","puppy","lapdog","hound"]]);
//[["inu","terrier","malamute","bulldog","spaniel","foxhound","pit bull terrier","mastiff","shepherd","basset","beagle","berger","bichon","collie","boxer","chihuahua","chow chow","dachshund","dalmatian","cocker","coonhound","setter","mountain","spitz","retriever","dane","labrador","husky","maltese","pekingese","pomeranian","poodle","labradoodle","pug","rottweiler","shih tzu"],[" dog"," puppy"]]);
//Wrote all these names and realized it wasn't very funny, plus too many location names for my liking. Ah well.
new Thing("dog thoughts",["dog thought,2-3"],["thoughts"]);
new Thing("dog thought",[],["HAY I'M DOG","I AM DOG HAY","WE DOG NOW???","HEY LET'S DOG OK???","CAN WE DOG NOW OK???","DOG STUFF YAYYYYY","BUTTS COME IN MANY FLAVORS","BUTTS YES","HURRAY!!!!!!!! BUTTS","YOUR BUTT SMELLS LEGIT","WOOF","BWURF","BAWF WOOF","GUESS WHAT?????????? WOOF","MY SPECIALTY. IS ROOFING.","HEY EVERYDOGGY","DOG DOG DOG DOG DOG DOG DOG","MY NAME. IS DOG. AND I HAVE MET YOU. HI!!!","!!!!!!!!!!!!!!!!!!!!!WHOAH","!!!!!!!!!YES NICE","EVERYTHING SO NICE WOW","WE GO MANGLE SQUIRREL NOW????? PLS","WOW!!!!!!!! SO EXCITE","I'M RLY EXCITE RIGHT NOW","DO YOU KNOW JUST HOW EXCITE I AM","DO YOU HAVE. ANY IDEA. JUST HOW EXCITE I AM.","A WALK????? YES WALK LOVE WALKS HURRAY!!!!!!","PEE ON THINGS HURRAY!!!!!!","YIP YIP YIP YIP YIP","YIP","I COULD GO FOR SOME SQUIRREL RIGHT ABOUT NOW","IF TEARING UP SQUIRRELS IS WRONG THEN WOOF WOOF WOOF WOOF WOOF WOOF WOOF","DOG??????????? DOG","I LICK YOUR FACE NOW OK???????","VERI GOOD :DDDDDDDD","I WAS RUNNING BUT I FORGOT WHY I WAS RUNNING SO THEN I STOPPED RUNNING AND NOW I AM NOT RUNNING ANYMORE.","I DON'T UNDERSTAND!!!!! BUT OK","UH","HELP I AM CHOKE ON SQUIRREL HELP","ARE YOU A SQUIRREL","NO WAY","DUDE THERE IS NO WAY","IS THAT, UH, OH NEVERMIND","OHNO WHY","MEOW I MEAN WOOF????? YES","All of this must of course remain absolutely confidenOH HEY WOOF WOOF WOOF","I AM THE DOGGEST","MORE DOG YES DOG","LESS CAT MORE DOG","HAHA I LOVE YOU","ONE DAY I WAKE UP AND I AM DOG WOW","IS THIS REAL LIFE","I AM SO DOG RIGHT NOW","WOW","WHY THIS","THIS IS GREAT"]);


//world subdivisions
new Thing("biome",["plain,1-5",["forest,0-4","jungle,0-4"],"mountain,0-3"]);

new Thing("continent",["country,1-10","sea,1-5"],[["continent of "],["A","Eu","Ame","Ocea","Anta","Atla"],["frica","rtica","ropa","rica","nia","sia","ntide"]]);//[["Eu","A","O","E"],["rt","lt","rm","t","tr","tl","str","s","m","fr"],["a","o","e","i"],["ri","ni","ti","fri","",""],["sia","nia","ca"]]);
new Thing("country",["region,1-10","battlefield,10%",".biome"],[["country of "],["Li","Arme","Le","Molda","Slove","Tur","Afgha","Alba","Alge","Tu","Fran","Baha","Su","Austra","Germa","In","Ara","Austri","Be","Ba","Bra","Ru","Chi","Ja","Tai","Bangla","Gha","Bou","Bo","Tas","Ze","Mon","Mo","Ne","Neder","Spai","Portu","Po","Por","Mol","Bul","Bru","Bur","Gro","Syl","Gui","Da","Gree","Bri","Ita"],["ly","dania","mas","vania","ce","nea","nau","topia","garia","gal","laska","golia","nisia","land","snia","livia","mania","than","nin","pan","wan","zil","ssia","na","rein","lgium","bia","ny","ce","stan","distan","nistan","dan","lia","nia","via","sia","tia","key","desh","dia"]]);
new Thing("region",["capital","city,1-10","village,2-15"],[["north ","east ","south ","west ","north-west ","north-east ","south-west ","south-east ","center ","oversea "],["hilly","rainy","lush","foggy","desertic","green","tropical","rich","barren","scorched"],[" region"]]);

//towns
new Thing("village",["residential area,1-4","commercial area,90%","police station,50%","fire department,40%","museum,5%","library,40%","farm,0-6","factory,0-2","cemetery,60%","research facility,4%"],"village");
new Thing("city",["monument,15%","monument,5%","residential area,4-9","commercial area,1-5","police station","police station,50%","fire department","fire department,50%","museum,40%","library,60%","hospital","farm,0-3","factory,1-4","cemetery","research facility,2%"],"city");
new Thing("capital",["monument,70%","monument,40%","monument,10%","residential area,7-15","commercial area,3-9","police station,2-5","fire department,1-3","museum,1-2","library,1-3","hospital,1-3","farm,0-2","factory,2-6","cemetery","cemetery,50%","research facility,1%"],"capital city");

//buildings
new Thing("monument",["tourist,5-30","souvenir shop,70%","souvenir shop,30%"],"*MONUMENT*");
new Thing("tourist",[".person"],"*PERSON*| (tourist)");

new Thing("commercial area",["street,1-5","bargain shop,60%","bargain shop,30%","souvenir shop,10%","fresh produce shop,60%","pet shop,60%","toy shop,60%","game shop,60%","office building,1-12"]);
new Thing("office building",["building hall","office,6-20",".building"],[["a tall","a stout","an unimpressive","a large","a humongous","a modern","a classic","a historic","a gray","a dull","a white","a black","a concrete","a glass-covered","an impressive","a beautiful","an old-fashioned","a boring","a newly-built","a fancy"],[" "],["office building","skyscraper","building"]]);

new Thing("residential area",["street,1-5","house,5-20","apartment building,0-5"]);
new Thing("house",["fire,0.3%","living-room","kitchen","bathroom,1-3","bedroom,2-5","attic","study,0-2","garden,90%","garage,90%",".building"],[["a small","a large","a big","a cozy","a bland","a boring","an old","a new","a freshly-painted","a pretty","an old-fashioned","a creepy","a spooky","a gloomy","a tall","a tiny","a fine","a happy little"],[" pink"," grey"," green"," yellow"," orange"," red"," blue"," white"," brick"," stone"," wooden","","",""],[" house"]]);
new Thing("apartment",["living-room,90%","kitchen","bathroom,1","bedroom,1-3","study,20%"]);
new Thing("apartment building",["fire,0.3%","apartment,6-20",".building"]);

//farms
new Thing("farm",["fire,0.3%","house,1-3","farmer,1-4","field,1-8","horse,30%","horse,30%","horse,30%","poultry,0-3","grain silo,0-2","barn,0-2","warehouse,0-2","storage shed,0-2"]);
new Thing("field",["grain","insect,5%","bird,10%","bird,5%","haystack,30%"],["wheat field","corn field","soy field","rice field","oat field","peanut field","tomato field","grape field","barley field","canola field","rye field","flower field"]);
new Thing("farmer",[".person"],"*PERSON*| (farmer)");
new Thing("grain",["plant cell"]);
new Thing("grain silo",["metal","grain"]);
new Thing("warehouse",["worker,0-2","small mammal,8%","ghost,0.3%","machine,0-4",".building"]);
new Thing("barn",[".building"]);
new Thing("storage shed",[".building"]);
new Thing("haystack",["grain","insect,10%","needle,0.1%"]);
new Thing("needle",["metal"]);

new Thing("factory",["worker,2-12","machine,1-12","pipes,40%","cables,0-1","public bathroom,60%","warehouse,0-2",".building"],[["toy","chocolate","car","yoghurt","processed food","pork products","canned beef","juice","soda","shoe","textile","computer","weapon","hardware"],[" factory"]]);
new Thing("worker",[".person"],"*PERSON*| (worker)");

new Thing("public bathroom",[".room","person,10%","person,1%","sink,1-4","toilet,1-4","mirror,0-3"],"restroom");

//offices
new Thing("building hall",["office worker,0-3","elevator,1-3","public bathroom,75%"],"entrance hall");
new Thing("elevator",["ghost,0.3%","office worker,0-3","metal","cables","mechanics"]);
new Thing("office",["office worker,0-3","cat,2%","meeting room,0-2","boss's office","cubicle,2-12","water cooler,0-2","public bathroom,75%","elevator"],[["Social","Web","Swift","Smart","Smooth","Huge","Large","Greed","Bank","Media","World","Smith","Channel","Stock","Dream","One","True","We","You","People","Planet","Wild","Standard","Ever","Quick","Fast","Real","Good","Great","Neat","Soft","Hard","Right","Evil","Okay","Nice","Mascot","Clever","Green","Blue","White","Black","Time","Century","Millenium","NotCorrupt","PrettyAlright","PrettyDamnGood","Actual","Apex","Nested","Star","Opti","General","Easy","What","Who","Where","This","That","Dat","Dem","Invest","Painless","Death","First","Shark","Bear","Truth","Trust","Venture","Swell","Kind","Myth","Mythic","Crown","Silver","Gold","Twin","Single","Double","Triple","Marvel","Wonder","Way","Ward","e","I"],["co","alys","isium","arium","orium","orius","arius","aria","oria","arion","orion","ilton","son","cube","Monkey","Dog","Century","Year","TV","Big","Money","Rich","Bucks","Axis","Venture","Fine","Universal","Pro","Unlimited","brothers","Tube","Grow","Friends","Planet","People"," People"," Plastics"," Fashion"," Trending"," TV"," Games"," Toys"," Video Games"," Video"," Sports"," Pets"," Social"," Websites"," Marketing"," Sales"," Trading"," Export"," Politics"," Strategy"," Health"," Medecine"," Gardening"," Agriculture"," Editions"," Mining"," Transports"," Voyages"," Tourism"," Art"," Assassinations"," Healthcare"," Software"," Hardware"," Automobile"," Care"," Education"," Security"," Security Systems"," Crafts"," Production"," Services","Blood"," Space"," Transfer"," Backup"," Resources"," Secret Research"," Banking"," Funding"," Gambling"," Law"," Lawyers"," Pictures"," Religion"," Goods"," Weapons"," Laundering"," Cartoons"," Comics"," Agronomics"," Ergonomics"," Economics"," Supplies"," Things"," Stuff"," Printing"," Architecture"," Landscaping"," Construction"," Railroads"," Engineering"," Science"," News"," Testing"," Appliances"," Standards","Studio"," Recording"," Enrichment"," Extraction"," Frivolities"," Realty"," Publishing"," Entertainment"," Propane"," Energy"," Business Solutions"," Councelling"," Event-planning"," Fundraising"," Electronics"," Electrics"," Records"," Slavery"," Distribution"," Distributors"," Accessories"," Fuels"," Motors"," Insurance","Corp"," Procedurals"],[" "],["Inc.","Corp.","Company","L.P.","Ltd.","L.L.C.","L.C.","Associates","Partners","United","Merger","& Co","International","Conglomerate"]]);
new Thing("office worker",[".person"],"*PERSON*| (employee)");
new Thing("office boss",[".person"],"*PERSON*| (boss)");
new Thing("cubicle",["office worker,80%","office worker,10%","computer","computer,10%","small bookshelf,30%","fridge,2%","nameplate,8%","calendar,20%","office toy,0-3","desk","chair","panel,2-3"]);
new Thing("boss's office",["office boss","office worker,10%","office worker,5%","computer","computer,10%","water cooler,10%",["bookshelf","small bookshelf"],"cupboard,0-2","fridge,20%","nameplate","calendar,80%","office toy,0-6","desk","armchair,50%","chair,2-4","tv,10%"]);
new Thing("meeting room",["office boss,2%","office worker,0-8","cat,2%","computer,30%","computer,10%","water cooler,40%",["bookshelf","small bookshelf"],"cupboard,0-2","fridge,20%","nameplate,0-4","calendar,50%","office toy,0-6","table","chair,4-12","tv,60%"]);
new Thing("office toy",["plastic","metal"],["colorcube","colorsnake","snowglobe","figurine","souvenir","toy magnet","kinetic toy","bobblehead","spinning top","executive ball clicker","bouncing ball","slinky","stress ball","magic 8-ball","yo-yo"]);
new Thing("panel",["plastic"]);
new Thing("calendar",["paper","ink"],[["calendar ("],["firemen","sexy athletes","half-naked ladies","kittens","puppies","ducklings","flowery nature","tourism","sharks","inspirational quotes","famous people","bears","funny cartoons","popular TV show characters","mayan","haikus","1-word-a-day"],[")"]]);
new Thing("nameplate",[["plastic","wood","metal"]]);
new Thing("water cooler",["plastic","water","push-button"]);

//small shops
new Thing("shop",["clerk,1-6",["customer,0-3","customer,0-15"],"desk,1-3","chair,0-3","tv,20%","warehouse,20%",".building"]);
new Thing("clerk",[".person"],"*PERSON*| (clerk)");
new Thing("customer",[".person"],"*PERSON*| (customer)");

new Thing("game shop",["video game stand,2-12","video game console,1-4","tv,1-3","computer,0-3",".shop"],[["Game","Gamer","Play"],["pro","shop","hub","go","cash","buy","now","grrrlz","bro","chump"]]);
new Thing("video game stand",["video game,2-20","plastic"],"video game stand");
new Thing("fresh produce shop",["produce stall,2-12",".shop"],[["Fresh","Green","Bio","Nature","Eco","Yum","Tasty"],["Produce","Froots","Fruits","Veggies","Vegetables","Life","Food"]]);
new Thing("produce stall",[["fruit pile,1-4","vegetable pile,1-4"],"glass","plastic","insect,10%"],"produce stall");
new Thing("fruit pile",["sugar","plant cell","insect,10%"],[["a pile of "],["apples","oranges","pears","figs","watermelons","bananas","kiwis","coconuts","lemons","limes","strawberries","raspberries","berries","blackberries","nuts","grapes","grapefruits","melons","peaches","apricots","pineapples","cherries","chestnuts","ginger","mangos","passion fruits","mangosteens","plums","lychees","kumquats","tangerines","rhubarb","durians","mulberries"]]);
new Thing("vegetable pile",["plant cell","insect,10%"],[["a pile of "],["potatoes","carrots","leeks","onions","garlic","spices","turnips","cabbages","lettuce","corn cobs","spinach leaves","cress","broccoli","kale","peas","radish","beets","tomatoes","cucumbers","zucchinis","peppers","eggplants","gourds","pumpkins","avocados","cauliflowers","artichokes","fava beans","beans","green beans","chickpeas","peanuts","soybeans","celery","asparagus","rutabagas","yams","olives"]]);//I'm putting tomatoes with vegetables and you can't stop me
new Thing("pet shop",["pet container,2-12","bird cage,1-6","vivarium,1-6","aquarium,1-6",".shop"],[["Pet","Cute","Adopt","Ani","Anima","World","Care","Woof","Meow","Purr"],["woof","meow","purr","dogz","catz","nimals","friends"]]);
new Thing("pet container",[["dog,1-4","cat,1-4"],"plastic"],["pet cage","pet box"]);
new Thing("vivarium",[["reptile,1-4","amphibian,1-4","insect,1-4"],"plastic","glass","dirt"]);
new Thing("aquarium",[["fish,1-6","cnidaria,1-4","mollusk,1-4","crustacean,1-4"],["fish,50%","cnidaria,50%","mollusk,50%","crustacean,50%"],"plankton,0-3","plastic","glass","water"]);
new Thing("bird cage",["bird","plastic","metal"]);
new Thing("toy shop",["toy box,2-12","video game console,40%","video game console,20%",".shop"],[["Toy","Play","Kidz","Yay","Magi","Super","Cosmo"],["time","pretend","play","toyz","dolls","blocks","stuff","fun"]]);
new Thing("toy box",["office toy,20%","office toy,20%","toy,0-8","doll,0-4"]);
new Thing("toy",[["wood","plastic"]],["spinning top","building blocks","construction set","castle playset","city playset","village playset","animal playset","dinosaur playset","wizard playset","family playset","warrior playset","underwater playset","cow-boy playset","space playset","figurines","chef playset","market playset","toy car","toy racing car","race tracks","boat model","airplane model","spaceship model"]);
new Thing("doll",["plastic","cloth"],[["robot","trendy","fashion","cyborg","nurse","chef","firefighter","police","construction worker","singing","dancing","talking","super","baby-care","shopkeeper","knight","action hero","wizard","gardener","science","movie","TV","reporter","alien","cosmonaut","rocket","future","time-travel","ice-cream","lovely","romance","radical","pretend","plastic","mutant"],[" "],["Cindy","Stacy","Barbara","Lois","Milly","Emily","Anette","Gordon","Brandon","Steve","Marcus","Pascal","Barney","Boris","baby","unicorn","dragon","dinosaur","monster","pony","teddy bear","cat","dog","bunny","bird","shark"]]);
new Thing("bargain shop",["stuff box,2-12",".shop"],[["Cheap","Haggle","Price","Poor","Cent","Money","Best","Save","Get","Found","Salvage","Dump"],["more","less","buy","shark","bargain","stuff","things","worth","shop","store","market","mart"]]);
new Thing("stuff box",["office toy,0-2","souvenir,20%","book,0-2","pants,20%","shirt,20%","underwear,20%","coat,20%","socks,20%","shoes,20%","hat,20%","glasses,20%","toy,0-2","doll,30%","video game console,10%","video game console,10%","cog,30%","cog,10%","unusual stone,1%","helmet,1%","armor,1%","medieval weapon,1%","painting,20%","painting,10%","dust,40%","insect,10%"]);
new Thing("souvenir shop",["souvenir,6-12",".shop"],["souvenir shop","gift shop"]);
new Thing("souvenir",[["wood","plastic","metal","glass"]],[["tower","pyramid","dome","bridge","statue","palace","castle","cathedral","arena","opera","ark","city","monument"],[" "],["model","replica","souvenir"]]);

//museums
new Thing("museum",["painting,0-3","museum room,2-12","tourist,2-10","clerk,1-3","desk,1-2","chair,2-6","souvenir,0-3",".building"]);
new Thing("museum room",["painting,1-10","tourist,0-20","tv,5%","chair,0-2"],"exhibition room");
new Thing("painting",["paint","wooden frame"],"*PAINTING*");
new Thing("paint",["oil","pigment"]);
new Thing("wooden frame",["wood"]);

//services
new Thing("fire department",["fire,0.2%","firefighter,3-6","desk,0-3","chair,1-4","fridge,60%","tv,60%","fire truck",".building"]);
new Thing("firefighter",[".person"],"*PERSON*| (firefighter)");

new Thing("police station",["police officer,2-6","desk,0-2","tv,40%","small bookshelf,0-2","chair,0-4",".building"]);
new Thing("police officer",[".person"],"*PERSON*| (police officer)");

new Thing("library",["bookshelf,10-30","painting,50%","painting,50%","painting,50%","desk,0-4","computer,0-4","chair,0-4","librarian,1-4","person,0-12",".building"]);
new Thing("librarian",[".person"],"*PERSON*| (librarian)");

//war stuff
new Thing("battlefield",["soldier,10-30","corpse,10-30","blood"]);
new Thing("soldier",[".person","arsenal","blood,20%","bullet wound,0-3"],[["*PERSON*| "],["(soldier)","(soldier)","(soldier)","(soldier)","(soldier)","(soldier)","(officer)","(lieutenant)","(captain)","(major)"]]);
new Thing("arsenal",["gas mask,20%","rifle,90%","knife,80%","handgun,90%","handgun,50%","knife,30%","ammo pack,0-4","grenade,0-4","bullet,0-5"]);
new Thing("bullet",["copper","lead"]);
new Thing("rifle",["steel","aluminium,50%","polymers,20%","bullet,0-6"]);
new Thing("handgun",["steel","aluminium,50%","polymers,20%","bullet,0-6"]);
new Thing("gun",[".handgun"]);
new Thing("knife",["steel","blood,10%"]);
new Thing("wound",["blood","worm,5%"],"wound");
new Thing("ammo pack",["bullet,0-20",["metal","plastic"]]);
new Thing("grenade",["iron","TNT",["metal","plastic"]]);
new Thing("TNT",["carbon","hydrogen","oxygen","nitrogen"],"TNT");
new Thing("gas mask",["metal","polymers","cloth"]);
new Thing("bullet wound",["blood","worm,5%","bullet,50%","bullet,30%","bullet,10%","bullet,2%"],"wound");

//hospitals
new Thing("hospital",["doctor,2-4","nurse,2-4","intern,2-4","hospital room,3-8","patient,0-3","desk,0-2","chair,0-2",".building"]);
new Thing("hospital room",["doctor,10%","nurse,20%","intern,20%","bed,1-2","patient,0-2","tv","table,75%","chair,0-2",".room"]);
new Thing("nurse",[".woman","blood,10%"],"*WOMAN*| (nurse)");
new Thing("doctor",[".person","blood,5%"],"*PERSON*| (doctor)");
new Thing("intern",[".person","blood,10%"],"*PERSON*| (intern)");
new Thing("patient",[".person","blood,15%","wound,0-3"],"*PERSON*| (patient)");

//[DATA EXPUNGED]
new Thing("research facility",["researcher,2-8","security guard,1-4","soldier,0-6","doctor,0-2","nurse,0-2",["corpse,0-3","",""],"containment room,1-12","top secret drawer,1-6",".building"]);
new Thing("researcher",[".person"],"*PERSON*| (researcher)");
new Thing("security guard",[".person","handgun","ammo pack,0-1"],"*PERSON*| (security guard)");
new Thing("containment room",[["portal","space animal","space monster","sea monster","bird","poultry","cat","dog","cetacean","fish","mollusk","plankton","reptile","amphibian","snake","small mammal","predatory mammal","herbivorous mammal","clam","worm","monkey","bear","shark","horse","insect","crustacean","dragon","person","ghost","ectoplasm","abomination","corpse","house","tree","machine","dinosaur","visitor","visitor furniture","medieval person","caveman","painting","","",""],"portal,1%","fire,1%","researcher,5%","researcher,5%","soldier,5%","soldier,5%","corpse,5%","corpse,5%","corpse,5%","corpse,5%"]);
new Thing("top secret drawer",["top secret folder,1-8","note,0-8","pen,30%","pen,10%","pen,5%","donut box,5%","can,2%","book,20%","book,20%","book,5%","book,5%","button,10%","button,10%","dust,60%","lint,40%"],"classified files");
new Thing("top secret folder",["top secret file,2-8","paper"],[["Classified Folder n°"],["0","1","2","3","4","5","6","7","8","9","",""],["0","1","2","3","4","5","6","7","8","9","",""],["0","1","2","3","4","5","6","7","8","9"]]);
new Thing("top secret file",[],[
["File ","Document ","Report "],["X","Z","A","B","L","S","T"],["-"],["0","1","2","3","4","5","6","7","8","9","",""],["0","1","2","3","4","5","6","7","8","9","",""],["0","1","2","3","4","5","6","7","8","9"],["<br>-"],
["Containment breach ¤¤¤","Subject ¤¤¤ attempted escape","Unusual events occuring","Possible breach of security measures in","Subject ¤¤¤ sighted","Witnesses report a ¤¤¤","Rumors of ¤¤¤","Singularity event","Subject ¤¤¤ attempted singularity","Retrieval of subject ¤¤¤","Accidental termination of subject ¤¤¤","Recovery of subject ¤¤¤","Recovery of a number of ¤¤¤","Accidental loss of ¤¤¤","New leads on ¤¤¤","Subject ¤¤¤ must now be kept away from ¤¤¤ at all times to avoid repeating the security breach that occurred","Locals report sightings of ¤¤¤","Subject ¤¤¤ transported","A number of ¤¤¤ were sighted","Subject ¤¤¤ has been predicted to have been","Retrieving supplies","Accidental destruction of all subjects","Retrieval of artifact ¤¤¤","Sightings of artifact ¤¤¤","Subject ¤¤¤ tried to merge with ¤¤¤","Subject ¤¤¤ sighted with artifact ¤¤¤","Experimentation done on ¤¤¤","Research ongoing on ¤¤¤","True nature of ¤¤¤ revealed","Gate to ¤¤¤ opened","Portal to ¤¤¤ closed","Relations friendly with ¤¤¤","Relations hostile with ¤¤¤","A team has been sent to investigate ¤¤¤","No news from the team sent to","Mission ¤¤¤ presumed to have been a failure; no further teams should be sent","Met with subject ¤¤¤","Artifact ¤¤¤ damaged but not destroyed","Artifact ¤¤¤ suspected to have been destroyed","Subject ¤¤¤ presumed dead","Subject ¤¤¤ unfortunately still alive","Phenomenons possibly caused by ¤¤¤ spotted","Phenomenons matching ¤¤¤'s behavior have been observed","Discussions on the whereabouts of ¤¤¤ took place","Subject ¤¤¤ travelled from ¤¤¤ to ¤¤¤","Subject ¤¤¤ sighted shape-shifting from a ¤¤¤ to a ¤¤¤","Subject ¤¤¤ started duplicating","Subject ¤¤¤ resumed duplicating","Subject ¤¤¤ will have/has started to ¤¤¤","Collision event between ¤¤¤ and ¤¤¤","Evidence of ¤¤¤"],[" "],
["in sector","in zone","in secured location","in facility","near site"],[" "],["X","Z","A","B","L","S","T"],["-"],["0","1","2","3","4","5","6","7","8","9","",""],["0","1","2","3","4","5","6","7","8","9","",""],["0","1","2","3","4","5","6","7","8","9"],[" "],
["on ¤¤/¤¤/¤¤¤¤","the day preceding ¤¤¤","following the ¤¤¤","in the hours leading to the ¤¤¤ event","in the hours following the ¤¤¤ event","directly after ¤¤¤","during the ¤¤¤ event"],
["; all researchers involved terminated","; all personnel involved terminated","; casualties estimated high to very high","; no casualties reported","; proper measures have been triggered","; more research is necessary","; further testing still needed","; casualties include half the local population","; casualties include all local wildlife",". Once again, do not, I repeat DO NOT ¤¤¤",". Do not, under any circumstances, attempt to ¤¤¤","; locals have been terminated","; locals have no memory of the event","; consequences of the event have been dealt with","","","","","",""],["."]
]);

//cemeteries
new Thing("cemetery",["gravedigger,0-2","person,0-3","cemetery shed,0-2","mausoleum,0-3","grave,10-30","ghost,20%","ghost,10%"],"cemetery");
new Thing("gravedigger",[".person","shovel,30%"],"*PERSON*| (gravedigger)");
new Thing("shovel",["wood","metal"]);
new Thing("cemetery shed",["gravedigger,0-2","table,20%","tv,20%","fridge,30%","chair,0-2","shovel,0-3","corpse,1%","ghost,1%",".building"],"shed");
new Thing("mausoleum",["tourist,8%","coffin,1-6","ghost,4%",["concrete","rock","marble"]]);
new Thing("grave",["coffin","coffin,5%","worm,0-2","insect,0-1",["concrete","rock","marble"],"dirt"]);
new Thing("coffin",["person,0.2%","corpse,98%","corpse,2%","ghost,2%","worm,0-3","insect,0-2","wood","cloth","nails"]);

new Thing("ectoplasm",["proton,3-7"],[["purple","fetid","green","yellow","blood-red","shiny","wispy","sparkly"],[" "],["ectoplasm"]]);
new Thing("ghost",["ghost body","ghost thoughts"],[["depressed","sad","lonely","wailing","screaming","stretching","clinking","sneezing","breathing","screeching","spinning","gasping","moaning","regretful","remorseful","vengeful","friendly neighborhood","skeletal","tentacled","conjoined","grasping","slimy","floating","mournful"],[" "],["ghost","spirit","apparition","phantom","poltergeist","specter","hauntling"]]);
new Thing("ghost body",["ectoplasm"],["\"body\""]);
new Thing("ghost thoughts",["ghost thought","ghost thought,20%"],["thoughts"]);
new Thing("ghost thought",[],["if only - she could hear me -","he needs to know - I'm sorry -","alone - I - wait -","I am so - very lonely -","when - will it end -","will it be - over soon -","do I - deserve this -","I regret - so much -","I miss you - so much -","please - never - ever die -","I must - wait here -","how many - centuries -","such is - my burden -","I cannot - feel a thing -","I have lost - all hope -","abandoned -","I float - forever -","I wander - for how long -","so spooky - right now -","that slime - isn't mine -","I rest - at last -","let's - be pals -","I sense - a presence -","you can - see me?","who you - gonna call -","can you - hear me now -"]);


//infrastructure
new Thing("street",["traffic accident,1%","urban life","person,0-5","driven car,0-20","driven bike,0-3","car,0-5","road","pavement"],[["*PERSON*|"],[" "],["street","avenue","boulevard","road","alley","bend","drive","place","hill","plaza"]]);
new Thing("road",[["asphalt","stone"]]);
new Thing("pavement",["note,3%","coin,4%","stone","dirt,5%"]);
new Thing("asphalt",["oil",".concrete"]);
new Thing("car",["engine","mechanics","tire,4"],[["parked "],["blue","red","white","black","grey"],[" "],["Chr","F","Chevr","Cad","H","Hyund","Maz","Niss","Suz","Lex","Merc","Aud","Volv"],["ysler","ord","olet","illac","onda","ai","da","an","uki","us","edes","i","o"]]);
new Thing("driven car",["person,1-4",".car"],[["blue","red","white","black"],[" "],["Chr","F","Chevr","Cad","H","Hyund","Maz","Niss","Suz","Lex","Merc","Aud","Volv"],["ysler","ord","olet","illac","onda","ai","da","an","uki","us","edes","i","o"]]);
new Thing("tire",["rubber","metal"]);
new Thing("bike",["mechanics","tire,2"]);
new Thing("driven bike",["person","person,5%",".bike"],"bike");
//["Chr","F","Chevr","Cad","H","Hyun","Maz","Niss","Suz","Lex","Merc","Aud","Volv"],["ysler","ord","olet","illac","onda","dai","da","an","uki","us","edes","i","o"]

//rooms
new Thing("building",["walls","roof"]);
new Thing("roof",["cat,2%","bird,10%","bird,10%","nest,2%","roof tiles"]);
new Thing("roof tiles",["ceramic"],"tiles");
new Thing("room",["visitor,0.1%","ghost,0.1%","walls"]);
new Thing("walls",["door,1-4","window,0-6",["wall,4","wall,4-8"]]);
new Thing("wall",[["plaster","wood"],"dirt,5%"]);
new Thing("plaster",["calcium","sulfur"]);
new Thing("marble",["calcium"]);
new Thing("stone",["rock"]);
new Thing("concrete",["rock","cement","water"]);
new Thing("cement",["calcium"]);
new Thing("marble",["calcium"]);
new Thing("door",["wood frame","glass,10%"]);
new Thing("window",["wood frame","glass"]);
new Thing("living-room",[".room","person,0-4","cat,10%","cat,10%","stuff box,5%","tv,95%","armchair,50%","armchair,50%","couch,90%","living-room table,50%","chair,1-6","painting,70%","painting,20%","mirror,2%","bookshelf,0-3","small bookshelf,0-2","desk,40%","computer,40%"]);
new Thing("kitchen",[".room","person,40%","person,20%","tv,40%","kitchen sink","cabinet,1-5","fridge","oven","chair,0-3","computer,5%","small bookshelf,5%","painting,30%","painting,10%"]);
new Thing("bedroom",[".room","person,40%","person,10%","cat,5%","stuff box,5%","tv,60%","bed","chair,0-4",["cupboard,90%","closet,90%"],"mirror,50%","bookshelf,0-2","small bookshelf,0-3","desk,40%","computer,40%","painting,60%","painting,20%"]);
new Thing("bathroom",[".room","person,10%","person,1%","cat,1%","sink,95%",["bathtub","shower"],"toilet","painting,20%","mirror,80%"]);
new Thing("study",[".room","person,30%","person,5%","stuff box,20%","tv,20%","desk,95%","computer,90%","chair,1-4","bookshelf,0-6","painting,70%","painting,20%","mirror,5%"]);
new Thing("garden",["person,40%","person,10%","dog,20%","dog,5%","cat,15%","grass","tree,50%","tree,50%","tree,20%","tree,5%","flowers,30%","hole,1%","hole,1%","hole,1%","poultry,1%","bird,20%","bird,10%"],["garden","lawn","backyard"]);
new Thing("garage",["person,20%","cat,2%","stuff box,30%","stuff box,20%","chair,0-3","car,90%","car,40%","car,5%","bike,40%","bike,30%","bike,10%","computer,5%","small bookshelf,30%","hole,1%","hole,0.5%","small mammal,5%","insect,15%","insect,15%","dirt,50%"]);
new Thing("hole",["corpse,20%","corpse,5%","blood,20%","shovel,20%","hole,0.5%","insect,25%","insect,15%","dirt"]);

//furniture
new Thing("cabinet",["wood frame","glass,30%",".cabinet content"]);
new Thing("cabinet content",["donut box,4%",["cheese,0-3",""],"water bottle,0-1","juice bottle,0-1","soda bottle,0-1",["can,0-6","cookie box,0-6"],"insect,2%"]);
new Thing("fridge",[".fridge content","plastic","metal grill,1-4","electronics"]);
new Thing("fridge content",["roast,15%","pasta,40%","pasta,10%","can,15%","donut box,5%","cake,3%","pie,3%",["yoghurt,0-6",""],["ice cream,0-6",""],["cheese,0-3",""],"water bottle,0-1","juice bottle,0-2","soda bottle,0-2","milk bottle,0-1","wine bottle,10%"]);
new Thing("oven",[["pie","cake","roast","",""],"plastic","metal grill,1-3","electronics"]);
new Thing("kitchen sink",[".sink"]);
new Thing("sink",[["porcelain","metal"],"organic matter,5%","pipes"]);
new Thing("toilet",["water","organic matter,15%","pasta,0.1%","porcelain","pipes"]);
new Thing("pipes",["metal","dirt"]);
new Thing("nails",["iron"]);
new Thing("metal",["iron"]);
new Thing("metal grill",["metal"]);
new Thing("porcelain",["silica"]);
new Thing("ceramic",["silica"]);
new Thing("chair",[["wood","plastic"],"nails,50%"]);
new Thing("armchair",[".chair","cloth"]);
new Thing("couch",[".armchair","tv remote,5%","coin,5%","pen,5%"],["couch","sofa"]);
new Thing("tv remote",["plastic","electronics"],"TV remote");
new Thing("coin",["organic matter,2%","dirt,2%","copper"]);
new Thing("gold coin",["gold"]);
new Thing("dirt",["organic matter,50%","dust"]);
new Thing("grease",["lipids","dust"]);
new Thing("dust",["molecule"]);
new Thing("crumbs",["organic matter"]);
new Thing("lint",["textile fibre"]);
new Thing("pen",["plastic","ink,80%"]);
new Thing("button",["plastic"]);
new Thing("note",["note writing","paper"]);
new Thing("note writing",[],["*NOTE*"]);
new Thing("bed",[".armchair","pillow,0-3"]);
new Thing("pillow",["feather","cloth"]);
new Thing("feather",["keratin"]);
new Thing("feathers",[".feather"]);
new Thing("mirror",["glass","portal,0.1%"]);
new Thing("glass",["silica"]);
new Thing("desk",["wood frame","drawer,0-6"]);
new Thing("cupboard",["cup,0-6","drinking glass,0-6","bowl,0-4","plate,0-8","wood frame","wood shelf,1-4","drawer,0-2"]);
new Thing("drinking glass",["glass"],"glass");
new Thing("bowl",["ceramic"]);
new Thing("cup",["ceramic"]);
new Thing("plate",["ceramic"]);
new Thing("closet",["portal,0.1%","skeleton,0.1%","hat,30%","hat,15%","pants,0-5","shirt,0-5","underwear,0-6","coat,0-3","socks,0-8","shoes,0-6","button,20%","wood frame","wood shelf,0-2"]);
new Thing("living-room table",[".table","drawer,0-2"],"table");
new Thing("table",[["wood","plastic"],"nails,50%"]);
new Thing("drawer",["note,0-8","office toy,30%","office toy,30%","pen,30%","pen,10%","pen,5%","donut box,4%","can,2%","book,20%","book,20%","book,5%","book,5%","button,10%","button,10%","dust,40%","lint,40%"]);
new Thing("note stack",["note,5-25"]);//lotsonotes
new Thing("bookshelf",["book,5-30",["plastic shelf,3-8","wood shelf,3-8","drawer,0-2"]]);
new Thing("small bookshelf",["book,1-8",["plastic shelf,1-6","wood shelf,1-6"]],["bookshelf"]);
new Thing("wood shelf",["wood","nails"],"shelf");
new Thing("plastic shelf",["plastic","nails,50%"],"shelf");
new Thing("wood frame",["wood","nails"]);
new Thing("book",["page,20-100"],"*BOOK*");
new Thing("page",["paragraph,1-8","paper"]);
new Thing("paper",["cellulose"]);
new Thing("cardboard",["cellulose"]);
new Thing("wood",["cellulose","worm,1%"]);
new Thing("cellulose",["glucids"]);
new Thing("paragraph",["character,50-300"]);
new Thing("character",["ink"],"*CHAR*");
new Thing("ink",["alcohol","oil"]);
new Thing("bathtub",["porcelain","pipes","dirt,30%","insect,5%","hair,30%"]);
new Thing("shower",["porcelain","pipes","dirt,30%","insect,5%","hair,30%"]);
new Thing("tv",["tv show","tv remote,20%","plastic","electronics"],[["plasma","wide-screen","high-resolution","black and white","small","cheap"],[" TV"]]);
new Thing("tv show",[],[["A movie about","A show about","A sitcom about","A TV show about","A cartoon about","A foreign show about","An ad with"],[" "],["stupid people","boring people","uninteresting people","tan people","foreigners","a cute couple","an obnoxious couple","a dysfunctional couple","magic kids","space people","scientists","heroes","antiheroes","superheroes","cavemen","knights","old-timey people","awkward teenagers","hundreds of people","insane people","cool hip kids","a kid and his pet","a kid and his teacher","a boy and a girl","businessmen","an old man and his wife","a young couple","cow-boys","pirates","ninjas","monsters","wizards","cleaning products","aliens","cute talking animals","artists","wacky animated animals","beloved cartoon characters","bears","sharks","small people"],[" "],["struggling with their emotions","trying to express their feelings","and ecology","and friendship","and feelings","and food","talking about stuff","doing things","kicking butt and taking names","in a post-apocalyptic world","running away from zombies","crying helplessly","getting lost in the woods","and their dream of starting a business","trying to achieve their life-long dream","trying to keep their promises","trying to destroy a cursed artifact","in school","looking away from explosions","hacking computers","telling jokes","delivering one-liners","shooting stuff","slaying monsters","going to space","travelling together","learning about life","dancing and singing","doing way gross stuff","learning martial arts","trying to kill each other","doing sports","trying to defeat a government conspiracy","in the century's biggest heist","involving hilarious quiproquos and misunderstandings","getting killed by a sociopath","fighting robots","killing aliens","rescuing baby animals","falling in love","going on a date","slowly turning evil","learning that violence is not the answer","doing magic","coming up with convoluted plans","exploring the sea","saving the world","involved in various mishaps","involved in hilarious pranks","with less-than-stellar writing","with neat visual effects","with a beautiful soundtrack","with an impressive amount of clichés","with a twist at the end","with brilliant acting"],["."]]);
new Thing("video game console",["plastic","electronics"],[["Mega","Ultra","Gene","Se","Ninten","Nin","Play","Game","Next","Retro","Dream","Sun","Kine","3D"],["station","do","sphere","sis","tron","ga","zor","boy","cast","nect","next"]]);

new Thing("machine",["computer keyboard,10%","engine,20%","mechanics","electronics,40%","metal","wood,10%","cables,40%","dirt,10%"],[["valve","pump","terminal","conveyor","forklift","girder","furnace","generator","hydraulics"]]);
new Thing("cables",["plastic","wire"]);
new Thing("wire",["copper"]);

new Thing("engine",["mechanics"]);
new Thing("mechanics",["cog,2-12","push-button,0-3","electronics,30%","cables,75%","wire,0-2","tube,0-3","nails,40%","insect,5%"],"mechanical components");
new Thing("cog",[["copper","plastic","iron","steel","aluminium"]],["cog","gear","spur gear","helical gear","bevel gear","harmonic drive","spring","pump","sprocket","wheel","chain","belt","track","bolts","gizmo","pulley","puffer","smoker","vent"]);
new Thing("push-button",["plastic","cables"],["lever","button","switch"]);
new Thing("tube",[["plastic","metal","glass"]]);

new Thing("electronics",["microchip,1-6","electronic component,1-6","wire,0-2"]);
new Thing("microchip",["electronic component,1-15","plastic,75%","copper,75%","silicon,25%","gold,5%"],["microchip"]);
new Thing("electronic component",["plastic,75%","copper,75%","silicon,25%","gold,5%"],["transistor","inductor","capacitor","diode","metagizmo","transmorpher","beeper"]);


//computers
new Thing("pixel paragraph",["pixel character,50-300"],"paragraph");
new Thing("pixel character",["bit,8"],"*CHAR*");
new Thing("computer",["computer screen","computer keyboard","computer mouse","electronics"],[["P","B","M","N","T","St","Pl","Bl","Gr","Fr","Sht","Fl"],["apple","indows","inux","oogle"],[" computer"]]);
new Thing("laptop",[".computer"],[["P","B","M","N","T","St","Pl","Bl","Gr","Fr","Sht","Fl"],["apple","indows","inux","oogle"],[" laptop"]]);
new Thing("computer keyboard",["plastic","electronics"],"keyboard");
new Thing("computer mouse",["plastic","electronics"],"mouse");
new Thing("computer screen",["internet browser","computer folder,1-4","software,0-4","video game,0-4","computer trashbin","plastic","electronics"],"screen");
new Thing("computer folder",["computer folder,0-2",["computer folder,0-6","disturbing computer image,1-10","stupid computer image,1-10","cute computer image,1-10","software,1-6","video game,1-6"]],[["/"],["my ","My ","misc ","Misc. ","various ","secret ","family ","Family ","shared ","Shared ","important ","Important ","public ","Public ","private ","Private ","","",""],["documents","docs","Documents","Songs","Music","Movies","Pictures","pictures","pics","photos","files","Files","things","stuff","stuff to sort"]]);
new Thing("computer trashbin",["computer folder,0-4","disturbing computer image,0-4"],"Trashbin");
new Thing("video game",[".computer file"],[
["Super ","Mega ","Ultra ","Final ","World of ","","","","",""],
["Bl","B","Fl","Gl","Z","Zw","Dw","M","W","Wh","C","F","G","Pl","Spl"],["ario","antasy","and","astle","ark","ork","org","urg","ink","arf","ine","ar","at","uster","aster","alaxy","ims","ultima","universe","izzard"],
["craft","vania","arria","arium","'s Revenge","'s Quest"," Bros"," Town"," Land"," World"," Party"," Quest"," RPG"," Horses"," Friends"," Girlz"," Online"," Fantasy"," Ultra"," Deluxe"," Fortress"," Racing"," Edit"," Maker"," Beta"," Trial"," Music"," Ultimate"," Resurrection"," The Movie : The Game"," 2"," 3"," II"," III"," 2000"," 3000"," GOTY Edition"," Deluxe Edition"," expansion pack"," [keygen]"," [CRACK]"," HD","","","","","","","","","","",""]
,[".soft"]
]);
new Thing("software",[".computer file"],[
["Photo","Touch","Pic","Morph","Kid","Cosmo","Astro","Ink","Web","Art","Movie","Music","Calc","Math","Phrase","Dictio","World","Bug","Shell","Folder","File","Program","Question","EZ","Easy","Ancestry","History","Encyclo","Sun","Speed","Health","Doc","School","Learn","Lang","Code","Prog","Note","Pixel","Simple","Line","Shape","Name","Phone","Insta","Love","Friend","Assist","Tut","Active","Micro","Macro","Shock","Laser","Disc","Index","Game","Trouble","Hobbie","House","Task","Sports","Car","Money","Finance","Password","Fun","Mail","Virus","Fire","Burn","Diet","Pet","Mission","Hyper","Flower","Biblio","Video","Party","Open","Closed","Magic"],
["shop","pic","pix","draw","thinker","brain","pad","glide","top","artist","words","writer","layer","net","nary","matic","ulator","ula","ulus","ify","izer","crusher","finder","find","sort","reply","info","pro","pedia","helper","creator","card","land","warrior","armor","wall","nova","manager","paint","pixel","namer","call","book","tales","media","wave","mail","-b-gone","care","serve","server","printer","designer","retriever","spy","link","Office","cracker","Edit","Editor"],
[" Pro"," - More Clipart edition"," Assistant"," Fusion"," Easy"," Plus"," Professional"," Gold"," extended edition"," Free"," freeware version"," trial"," shareware"," Web"," Online"," Edit"," Illustrated"," 2.0"," 1.1"," 1.2"," 3.0"," [keygen]"," [CRACK]"," HD","","","","","","","","","","",""]
,[".soft"]
]);
new Thing("computer file",["bit,50-100"],["file"]);
new Thing("bit",[],["0","1"]);
new Thing("cute computer image",[".computer file"],[
["An image of ","A picture of ","A short video of ","A drawing of ","A slideshow of ","A video of "],
["a cat","two cats","cats","kittens","a kitten","a duckling","a duck","ducks","a puppy","a baby seal","a dog","puppies","a squid","a dolphin","a bunny","bunnies","baby bunnies","a parrot","two parrots","a gecko","a chameleon"],[" "],
["playing with a ball","befriending other animals","making cute faces","wearing silly hats","trying to play piano","in various shenanigans","playing with cardboard boxes","being really excited","sneezing","sleeping","waking up","falling asleep"],["."]
]);
new Thing("stupid computer image",[".computer file"],[
["An image of ","A picture of ","An album of ","A short video of ","A video of ","A compilation of "],
["some dude","some girl","a rather unattractive fellow","a rather unattractive lady","a grotesque individual","a clearly drunk guy","a clearly drunk girl","a bunch of kids with popped collars","some muscular guy","a masked guy","some guy with a horse mask","cosplaying kids","orange people","midgets","a midget","a movie star","some celebrity","high school kids","children","a creepy old person","old people"],[" "],
["setting fire to some stuff","involved in a retardedly dangerous prank","trying something extremely dangerous","involved in what was probably a stupid bet","doing stupid stuff","in anatomically questionable shenanigans","getting stupidly injured","stretching the limits of stupidity","in an absurdly dangerous stunt","dancing to some cheesy music","pestering dangerous animals","doing that thing with the stuff","trying too hard to be cool"],["."]
]);
new Thing("disturbing computer image",[".computer file"],[
["An image of ","A possibly illegal image of ","A crude representation of ","A disturbing representation of ","A daring representation of ","A video of "],
["a ¤¤¤¤¤¤","a group of ¤¤¤¤¤¤","several ¤¤¤¤¤¤","a couple of ¤¤¤¤¤¤"],[" "],
["in the process of ¤¤¤¤¤¤","being ¤¤¤¤¤¤ by","trying to ¤¤¤¤¤¤ on","in a ¤¤¤¤¤¤ with","involved in ¤¤¤¤¤¤ with","holding"],[" "],
["another ¤¤¤¤¤¤","two other ¤¤¤¤¤¤","their ¤¤¤¤¤¤","inside a ¤¤¤¤¤¤'s ¤¤¤¤¤¤","a ¤¤¤¤¤¤","a strange-looking ¤¤¤¤¤¤","a bewildered ¤¤¤¤¤¤"],["."]
]);
new Thing("forum post",[".pixel paragraph"],[
["A poll about ","An irate little person ranting about ","A bunch of shut-ins arguing about ","Two people sharing their love for ","Some hipsters chatting about ","Concerned parents discussing ","An inflammatory post about ","A thoughtful comment on ","An insightful post regarding ","A troll post about ","A flame war about ","Some spam about ","A comment on ","A post about ","A discussion about ","An ongoing discussion about ","A heated argument about ","A passionate discussion about ","A single person complaining about ","A group of persons enthusiastic about "],
["politics","countries","cooking","food","favorite foods","pets","religion","religious beliefs","crime","funny videos","music","favorite bands","webcomics","comics","art","video games","movies","dating advice","relationships","favorite books","famous people","astronomy","astrophysics","science","memes","spacetime","physics","foreign countries","cats","aliens","a bunch of nonsense","a controversial book","a controversial movie","friendship","stuff people put in their pockets","computers","cute things","creepy things","stupid things","gardening","cars","crime","youth","illicit substances","knitting","sports","meditation","hobbies","whatever's trendy right now","a debated topic","superheroes","trolling","jimmies being rustled","filenames","an online universe generator"],["."]
]);
new Thing("internet browser",["nested,0.5%","website"],[["Blazewolf","Interweb Discoverer","Bismuth","Savannah","Theatre"],[".soft"]]);
new Thing("website",[["forum post,1-10","disturbing computer image,1-10","cute computer image,1-10","stupid computer image,1-10","website,1-10"],"website,1-3"],[["www."],
["one","4","9","on","live","wiki","re","net","home","neat","fat","free","cool","not","something","everything","dat","my","you","that","this","face","tv","sick","cute","creepy","me","hurr","crap","web","bizz","wrong"],
["chon","speak","news","chat","gog","ddit","bad","nasty","forum","gross","pal","friends","world","rama","search","stick","retarded","tard","ville","town","cat","cats","durr","tube","space","book","music","directory"],
[".com",".com",".com",".net",".org"]]);

//hell, might as well
new Thing("internet",["website,20"],"The Internet");
new Thing("google",[".website"]);
new Thing("wikipedia",[".website"]);
new Thing("4chan",[".website"]);
new Thing("nested",["universe"],"www.orteil.dashnet.org/nested");
new Thing("reddit",[".website"]);
new Thing("facebook",[".website"]);
new Thing("/tg/",[".website"]);
new Thing("/b/",[".website"]);
new Thing("/v/",[".website"]);
new Thing("/x/",[".website"]);



//food
new Thing("milk",["glucids","lipids","calcium"]);
new Thing("bottle",[["glass","plastic","cardboard"],"label"]);
new Thing("glass bottle",["glass"],"bottle");
new Thing("glass jar",["glass"],"jar");
new Thing("label",["paper"]);
new Thing("milk bottle",[".bottle","milk"]);
new Thing("wine bottle",[".bottle","wine"]);
new Thing("wine",["sugar","alcohol"]);
new Thing("water bottle",[".bottle","water"]);
new Thing("juice bottle",[".bottle","juice"]);
new Thing("soda bottle",[".bottle","soda"]);
new Thing("juice",["water","sugar"],[["apple","pear","banana","tomato","pineapple","pumpkin","carrot","grape","orange","papaya","kiwi","mango"],[" juice"," juice"," juice"," smoothie"]]);
new Thing("soda",["water","sugar"],[["apple","pineapple","grape","orange","purple","brown"],[" soda"]]);
new Thing("can",["water","sugar","salt","mold,3%","metal"],[["canned "],["apple bits","pear bits","tomatoes","pineapple","pumpkin","carrots","meat","pork","beef","peas","mushrooms","olives","fish","burger","corn"]]);
new Thing("cookie box",["sugar","salt,70%","mold,3%","cardboard"],[["box of "],["cheesy","cheese","sugar","cream","milk","milky","whole-grain","frosted","glazed","apple","nut","fruit","chocolate","butter","oat","wheat","corn","animal-shaped","meat","crunchy","crispy"],[" "],["puffs","poofs","cookies","biscuits","rolls","pops","snacks","crackers","cereals","pies","tarts"]]);
new Thing("yeast",[".cell"]);
new Thing("yoghurt",["milk","sugar","yeast"],[["strawberry","vanilla","cherry","pear","plain"],[" yoghurt"]]);
new Thing("ice cream",["milk","sugar","ice"],[["strawberry","vanilla","cherry","chocolate"],[" ice cream"]]);
new Thing("cheese",["milk","yeast","mold,30%"],[["roquefort","cheddar","gouda","edam","colby","mozarella","processed cheese","stilton","goat cheese","gorgonzola","brie","camembert"]]);
new Thing("roast",[".meat","spices"],[["chicken","beef","pork","duck","mutton"],[" roast"]]);
new Thing("spices",[".organic matter"],[["pepper","garlic","onions","rosemary","sage","thyme"]]);
new Thing("meat",["blood vessels,5%","bones,5%","fat,50%","muscles","salt"]);
new Thing("tomato sauce",["glucids","meat,20%","salt"]);
new Thing("pasta",["salt","glucids","cheese,5%","tomato sauce,20%"],["spaghetti","noodles","fusilli","fettuccine","fettuce","tagliatelle","cannelloni","penne","rigatoni","farfalle","tortelloni","ravioli","gnocchi"]);
new Thing("pastry",["sugar","salt","dough"],"pastry");
new Thing("pie",[["fruit jam","meat"],".pastry"],"pie");
new Thing("cake",[".pastry"],[["chocolate","white chocolate","chestnut","fruit","huge","impressive","ornate","glazed","colorful","cheese","nut","delicious"],[" cake"]]);
new Thing("fruit jam",["plant cell","sugar"]);
new Thing("donut box",["donut,0-12","cardboard"],"doughnut box");
new Thing("donut",[".pastry"],[["vanilla ","strawberry ","raspberry ","cherry ","chocolate ","coconut ","cream ","cinnamon ","bacon ","sprinkly ","frosted ","glazed ","powdered ",""],["doughnut"]]);
new Thing("sugar",["glucids"]);
new Thing("dough",["glucids","lipids"]);

//visitors
new Thing("visitor",["visitor body","visitor psyche"],"visitor");
new Thing("visitor body",["visitor head","visitor head,2%","visitor torso","visitor arm,99%","visitor arm,2%","visitor arm,99%","visitor leg,99%","visitor leg,99%","visitor leg,2%"],"body");
new Thing("visitor torso",["visitor chest","visitor pelvis",".body part"],"torso");
new Thing("visitor chest",[".body part"],"chest");
new Thing("visitor pelvis",["visitor naughty bits",".body part"],"pelvis");
new Thing("visitor naughty bits",[".soft body part"],["thrusher"]);
new Thing("visitor arm",["visitor hand","visitor elbow,2","visitor armpit",".body part"],"arm");
new Thing("visitor hand",["visitor finger,3",".body part"],"hand");
new Thing("visitor finger",[".body part"],"finger");
new Thing("visitor elbow",[".body part"],"elbow");
new Thing("visitor armpit",["visitor ooze,70%",".soft body part"],"armpit");
new Thing("visitor leg",["visitor foot","visitor knee",".body part"],"leg");
new Thing("visitor foot",["toe,4","visitor ooze,40%",".body part"],"foot");
new Thing("visitor toe",[".body part"],"toe");
new Thing("visitor knee",[".body part"],"knee");
new Thing("visitor head",["visitor mouth","eye,0-4","skull"],"head");
new Thing("visitor eye",["eye flesh","visitor ooze,20%"],"eye");
new Thing("nose",["nostril,2",".body part"],"nose");
new Thing("visitor mouth",["visitor teeth","tongue,2","visitor ooze"],"mouth");
new Thing("visitor teeth",["steel"],"teeth");
new Thing("visitor ooze",["bacteria,40%","organic matter","sulfur"],"ooze");

new Thing("visitor psyche",["visitor thoughts","visitor memories"],"psyche");
new Thing("visitor thoughts",["visitor thought,1-3"],"thoughts");
new Thing("visitor memories",["visitor memory,1-2"],"memories");
new Thing("visitor thought",[],["ACK!!! ACK ACK ACK","ACK ACK AAAACK ACK ACK","ACK, ACKKKKKKKK","AAAAAAAAAACKKKKKKK","Ack.","Ack?","Ack... Ack ack ack.","Ack ack ock ack!","Ack eck.","Ack ACK AAAAACK","AACK, ACK ACK ACK!","AAAAACK ACK ACK ACK","ACKACKACK, ACK!!!","Ackack, ackackackack?","...ack...","Hehuck.","Whoack."]);
new Thing("visitor memory",[],[["Ack ack...","Ack, ack ack...","Ack.","...Ack ack.","Ack ack ack."],["",""," Ack ack ack ack."," Ack."," Ack, ack ack."," Ack ack ack..."," ...ack ack ack."," ...Ack."," Ack."]]);

new Thing("named visitor",[".visitor"],[["B"],["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","!","?",";",",",".",":","/","*","#","¤","+","-","="," "],["rt"],["y","ie","ington","inson","son","","","","","","",""]]);

new Thing("visitor city",["named visitor,0-8",["space animal,0-3",""],"visitor neighborhood,1-8"],"visitor city");
new Thing("visitor neighborhood",["named visitor,0-8",["space animal,0-3",""],"visitor building,2-16"],"neighborhood");
new Thing("visitor building",[["named visitor,0-8",""],"visitor room,1-8"],[["a tall","a wide","a spiralicious","a twisty","a holographic","a composite","a stout","a long","a domed","an underground","a submerged","a gigantic"],[", "],["green","blue","purple","white","gray","translucent","bright","porous","microsthetic","turbified","motorized","hovering","meshed","towered","automated","ridged"],[" "],["glumporium","swapmarket","slickmarket","juicehouse","scienceteria","faceteria","homezone","orbshop","oozeshop","marklorion","hive","holotekt"]]);
new Thing("visitor room",["named visitor,60%","named visitor,30%","named visitor,10%","named visitor,10%","named visitor,10%","space animal,10%","visitor furniture,1-6",".room"],"room");
new Thing("visitor furniture",["abomination,1%","space animal,3%","named visitor,2%","organic matter,5%",["glass","metal","concrete","plastic"]],[["symbio","opto","auto","synchro","thru","ato","ecto","diplo","plasti","pasta","pluta","elu","gubri","capra","lubio","logi","plato","micro","alto","tele","meta","anti","poly","mono","corvo"],["shid","synth","shaver","shist","mizer","mucus","twister","ridger","cutter","mac","maker","ctory","ctamid","chton","leaker","grater","board","frame","table","stand","plug","masher","greeter","mobile","pin","vat","tron","drone","chron","tub","fridge","pool","box","cube","morpher","phraser"]]);
new Thing("visitor installation",["named visitor,0-4",["space animal,0-3",""],"visitor building,1-3"],[["pod","grub","egg","limb","ooze","tendril","bulb","pulp","energy","smoke","hive","moisture","cat"],[" "],["materializer","synthesizer","factory","farm","collector","cultures","pit","fields","crops","barn","vat"]]);
new Thing("visitor ship",["named visitor,1-3","person,20%","space animal,30%","visitor furniture,1-6","metal"],"visitor UFO");


//medieval and ancient
new Thing("medieval continent",["medieval land,1-6","sea,1-5"],["explored continent"]);
new Thing("medieval land",["medieval region,1-10","medieval battlefield,10%",".biome"],[["realm","kingdom","empire","dominion"],[" of "],["G","P","S","St","Sh","B","F","K","Z","Az","Oz"],["","","","r","l"],["u","o","a","e"],["r","sh","nd","st","sd","kl","kt","pl","fr","ck","sh","ff","gg","l","lig","rag","sha","pta","lir","limd","lim","shim","stel"],["i","u","o","oo","e","ee","y","a"],["ll","th","h","k","lm","r","g","gh","n","m","p","s","rg","lg"]]);
new Thing("medieval region",["medieval capital","medieval village,2-6","dungeon,15%","dungeon,5%"],[["hilly","rainy","lush","foggy","desertic","green","tropical","rich","barren","scorched"],[" "],["shire","province","county","parish","pale"]]);

new Thing("ancient continent",["ancient land,1-5","sea,1-5"],["continent"]);
new Thing("ancient land",["ancient plain,0-5",["ancient forest,0-4","ancient jungle,0-4"],"mountain,0-3"],[["hilly","rainy","lush","foggy","desertic","green","tropical","rich","barren","scorched"],[" land"]]);

//medieval people
new Thing("medieval clothing set",["medieval hat,30%","medieval pants,98%","medieval shirt,98%","medieval coat,50%","medieval shoes,80%","medieval underwear,99%"],"clothing");
new Thing("medieval man",[".medieval person"],"*MEDIEVAL MAN*");
new Thing("medieval woman",[".medieval person"],"*MEDIEVAL WOMAN*");
new Thing("medieval person",["body","medieval psyche","medieval clothing set"],"*MEDIEVAL PERSON*");

new Thing("medieval psyche",["medieval thoughts","medieval memories"],"psyche");
new Thing("medieval thoughts",["black hole,0.01%",["medieval thought,2-3"]],"thoughts");
new Thing("medieval thought",[],["*MEDIEVAL THOUGHT*"]);
new Thing("medieval memories",["medieval memory,2-4"],"memories");
new Thing("medieval memory",[],["*MEDIEVAL MEMORY*"]);

new Thing("medieval clothing",[["leather","cloth"]],["clothing"]);
new Thing("medieval pants",[".medieval clothing"],["pants"]);
new Thing("medieval shirt",[".medieval clothing"],["shirt"]);
new Thing("medieval underwear",[".medieval clothing"],["underwear"]);
new Thing("medieval coat",[".medieval clothing"],["coat","cloak","cape","robe","mantle"]);
new Thing("medieval shoes",["leather,50%","wood"],["shoes","clogs"]);
new Thing("medieval hat",[".medieval clothing"],["hat","hood","headdress"]);
new Thing("armor",["metal"],["chain-mail armor","plate armor","lamellar armor","scale armor","brigandine","cuirass","gauntlets","pauldrons","spaulders","vambraces","greaves"]);
new Thing("helmet",["metal"],["helm","helmet"]);
new Thing("medieval weapon",["metal","wood"],["sword","longsword","rapier","bow","shortbow","longbow","crossbow","mace","spear","dagger","pole axe","knife","halberd","axe","javelin","hatchet","battleaxe","warhammer","maul","staff","harpoon","scimitar","cleaver","morningstar","club"]);

new Thing("medieval peasant",[".medieval person"],"*MEDIEVAL PERSON*| (peasant)");
new Thing("medieval priest",[".medieval person"],"*MEDIEVAL PERSON*| (priest)");
new Thing("medieval servant",[".medieval person"],"*MEDIEVAL PERSON*| (servant)");
new Thing("medieval noble",[".medieval person"],"*MEDIEVAL PERSON*| (noble)");
new Thing("medieval guard",[".medieval person"],"*MEDIEVAL PERSON*| (guard)");
new Thing("medieval shopkeeper",[".medieval person"],"*MEDIEVAL PERSON*| (shopkeeper)");
new Thing("medieval innkeeper",[".medieval person"],"*MEDIEVAL PERSON*| (innkeeper)");
new Thing("medieval king",[".medieval person"],[["*MEDIEVAL MAN*| ("],["king","emperor","prince"],[")"]]);
new Thing("medieval queen",[".medieval person"],[["*MEDIEVAL WOMAN*| ("],["queen","empress","princess"],[")"]]);
new Thing("wizard",[".medieval person"],[["*MEDIEVAL PERSON*| ("],["court","battle","rogue","corrupt","druid","bard","adept","thaumaturgist","shaman","healing","ice","frost","snow","arcane","lightning","thunder","earth","earthquake","nature","animal","shape-shifting","death","undeath","spark","fire","lava","locust","poison","rainbow","mist","fog","dust","air","wind","cloud","tornado","shark","punch","kick","song","skeleton","psycho","illusion","flying","summoner","thief","barbarian","dragon","gem","sky","star","dark","paladin","luck","time","space","blade"],[" "],["mage","magician","wizard"],[")"]]);
new Thing("medieval gravedigger",[".medieval person","shovel,30%"],"*MEDIEVAL PERSON*| (gravedigger)");
new Thing("medieval corpse",["body","medieval clothing set","blood,35%","worm,20%","worm,10%"],"*MEDIEVAL PERSON*| (dead)");

//medieval towns
new Thing("medieval village",["townwall,20%","watchtower,15%","medieval monument,50%","medieval residential area,1-4","medieval commercial area,1-2","medieval temple,0-2","medieval farm,4-8","medieval cemetery,50%","wizard tower,5%"],"village");
new Thing("medieval capital",["castle","townwall","medieval monument,70%","medieval monument,20%","medieval residential area,3-12","medieval mage quarter,50%","medieval mage quarter,20%","medieval temple,1-3","medieval commercial area,2-6","medieval farm,2-6","medieval cemetery"],["stronghold","fortress","fort","hold","palace","main city","citadel"]);

new Thing("castle",["medieval peasant,1-4","medieval noble,0-2","medieval guard,2-8","castle keep","giant monster cage,1%","watchtower,1-6","medieval temple,30%","medieval inn,40%","medieval house,1-4","medieval monument,70%","medieval monument,20%","moat,30%","gatehouse","medieval wall"]);
new Thing("gatehouse",["medieval guard,1-3","portcullis,1-2","wood","medieval wall"]);
new Thing("portcullis",["wood","metal"]);
new Thing("moat",["water,50%","dirt"]);
new Thing("medieval monument",[["stone","marble"]],["fountain","memorial","statue","well","altar"]);
new Thing("townwall",["medieval guard,1-8","watchtower,1-6","medieval wall"]);
new Thing("watchtower",["medieval guard,1-2","medieval chest,30%",".medieval building"]);
new Thing("castle keep",["great hall","noble medieval living quarters,1-3","noble medieval bedroom,2-5",".medieval building"]);
new Thing("great hall",["medieval king,90%","medieval queen,90%","throne,2","wizard,0-3","medieval noble,1-6","medieval guard,1-4","medieval servant,1-4","medieval table","medieval table,60%","medieval chair,3-8","medieval chest,1-4","medieval clutter,0-4","medieval meat,30%","sack of medieval food,0-2","medieval food,0-2","sack of grain,50%","medieval fireplace","medieval fireplace,50%","dog,60%","dog,30%","cat,30%",".medieval room"],"throne room");
new Thing("medieval residential area",["medieval house,3-8"],"housing district");
new Thing("medieval commercial area",["medieval inn,1-2","medieval armor shop,0-2","medieval tool shop,0-2","medieval clothing shop,0-2","medieval butcher shop,0-2","medieval food shop,0-2","medieval apothecary shop,0-2"],"trade district");
new Thing("medieval mage quarter",["wizard tower,1-5","medieval inn,0-1","medieval apothecary shop,0-3"],"mage district");
new Thing("medieval house",["medieval living quarters","medieval bedroom","medieval bedroom,50%",".medieval building"],[["a small","a large","a big","a cozy","a bland","a boring","an old","a new","a freshly-painted","a pretty","an old-fashioned","a creepy","a spooky","a gloomy","a tall","a tiny","a fine","a happy little"],[" hovel"]]);
new Thing("medieval building",["medieval walls","roof"],"building");
new Thing("medieval room",["visitor,0.1%","ghost,0.1%","medieval walls"],"room");
new Thing("medieval walls",["door,1-4","window,0-6",["medieval wall,4","medieval wall,4-8"]],"stone walls");
new Thing("medieval wall",["wood","stone","dirt,20%"],"stone wall");
new Thing("medieval living quarters",["medieval peasant,0-4","medieval pantry","medieval table","medieval table,30%","medieval chair,1-6","medieval chest,0-3","medieval clutter,0-2","medieval meat,30%","sack of medieval food,0-2","medieval food,0-2","sack of grain,50%","medieval fireplace,90%","dog,60%","dog,30%","cat,30%","poultry,10%","insect,70%","insect,40%",".medieval room"],"living quarters");
new Thing("medieval bedroom",["medieval peasant,0-2","medieval bed","medieval bed,20%","medieval table,30%","medieval chair,0-4","medieval chest,0-2","medieval clutter,0-2","medieval fireplace,40%","dog,10%","dog,10%","cat,20%","insect,70%","insect,40%",".medieval room"],"bedroom");
new Thing("medieval pantry",["medieval peasant,10%","medieval meat,0-4","sack of medieval food,0-8","medieval food,0-8","sack of grain,0-6","ale keg,0-3","medieval chest,0-2","medieval clutter,0-2","insect,0-4",".medieval room"],"pantry");
new Thing("noble medieval living quarters",["wizard,10%","medieval noble,0-4","medieval servant,0-3","medieval pantry,0-2","medieval table","medieval table,60%","medieval chair,1-8","medieval chest,1-4","medieval clutter,0-4","medieval meat,30%","sack of medieval food,0-2","medieval food,0-2","sack of grain,50%","medieval fireplace","medieval fireplace,50%","dog,60%","dog,30%","cat,30%",".medieval room"],"living quarters");
new Thing("noble medieval bedroom",["medieval noble,0-2","medieval servant,0-2","medieval bed","medieval bed,20%","medieval table,50%","medieval chair,0-4","medieval chest,1-3","medieval clutter,0-3","medieval fireplace,80%","dog,10%","dog,10%","cat,20%",".medieval room"],"bedroom");
new Thing("medieval fireplace",["fire","ash","wood","stone"],"fireplace");
new Thing("medieval temple",["medieval priest,1-3","medieval noble,0-2","medieval peasant,0-4","medieval altar,1-2","medieval table,70%","medieval bench,2-6","medieval chair,1-3","medieval chest,1-4","medieval clutter,0-4","medieval fireplace,20%",".medieval room"],[["temple of the","church of the","chapel of the","house of the","abbey of the","cathedral of the","shrine of the","sanctuary of the","priory of the"],[" "],["blinding","sacred","holy","unholy","bloody","cursed","marvellous","wondrous","pious","miraculous","endless","unending","undying","infinite","unworldly","worldly","divine","demonic","ghostly","monstrous","tentacled","all-knowing","rational","pretty good","vengeful","hallowed"],[" "],["light","star","beam","sphere","goddess","god","lords","sisterhood","brotherhood","skies","pact","sect","harmony","discord","child","entity","ghost","builders","makers","guide","wit","story","tale","unicorn","flame","fountain","locust","squid","gembaby","father","mother"]]);
new Thing("giant monster cage",[["dragon","sea monster"]],"giant cage");

new Thing("medieval shop",["medieval shopkeeper,1-2","medieval peasant,0-2","medieval noble,40%","medieval table,80%","medieval chair,0-2","medieval chest,0-2","medieval clutter,1-3",".medieval building"],"shop");
new Thing("medieval armor shop",["armor,2-8","medieval weapon,2-8","treasure,30%","anvil",".medieval shop"],[["armors & swords","swords","bows","maces","armor","weapon","blacksmith","forge","equipment","gear"],[" shop"," market"," store"]]);
new Thing("medieval tool shop",["medieval clutter,1-6","medieval chest,1-6",".medieval shop"],[["wares","tools","miscellaneous","utilities","equipment","gear","general"],[" shop"," market"," store"]]);
new Thing("medieval clothing shop",["medieval pants,1-3","medieval shirt,1-3","medieval coat,1-3","medieval underwear,0-2","medieval shoes,1-3","medieval hat,0-3","cloth,1-4","loom",".medieval shop"],[["hat","clothing","outfit","cloth","textiles","coats","cloak","garments","cobbler's"],[" shop"," market"," store"]]);
new Thing("medieval butcher shop",["medieval meat,2-10","medieval food,0-3",".medieval shop"],[["butcher","meat"],[" shop"," market"," store"]]);
new Thing("medieval food shop",["sack of grain,1-6","sack of medieval food,1-6","medieval food,2-5","medieval meat,1-4",".medieval shop"],[["baker's","ingredients","groceries","farmer's","cook's"],[" shop"," market"," store"]]);
new Thing("medieval apothecary shop",["potion,1-8","unusual stone,1-8","unusual plant,1-8","unusual ingredient,0-4","wizard,20%",".medieval shop"],["rare ingredients shop","potion shop","cures and remedies","alchemy essenitals","unusual wares shop","apothecary"]);
new Thing("medieval inn",["medieval innkeeper,1-2","medieval peasant,0-3","medieval guard,0-3","medieval noble,50%","medieval bedroom,2-6","tankard,1-4","ale keg,1-4","medieval table,1-3","medieval chair,2-4","medieval chest,0-2","medieval clutter,1-3",".medieval building"],[["inn of the ","tavern of the "],
["bleeding","smoking","witching","flying","burning","rabid","winking","dead","standing","tasty","meaty","fat","thirsty","hungry","starving","lone","cheerful","singing","dancing","travelling","lost","haunted","cursed","holy","magic","sorcerous","shy","fair","tipsy","drunk","sleeping","snoring","screaming","moaning","iron","resting","sulking","hidden","raving","prancing","filthy","nested","squealing"],[" "],
["walrus","king","queen","princess","prince","bear","witch","wizard","mage","barbarian","shark","dog","cat","castle","fish","rabbit","bull","spider","cake","potion","wanderer","traveller","tree","fairy","pixie","unicorn","dragon","mandrake","tankard","bottle","cobbler","blacksmith","jester","nettle","cookpot","anvil","scholar","monk","idiot","raven","squire","skeleton","beggar","gembaby","pig"]]);
new Thing("wizard tower",["wizard,95%","wizard,20%","medieval servant,30%","unusual ingredient,1-4","medieval table,80%","medieval chair,1-3","medieval chest,1-4","medieval clutter,2-4",".medieval building"]);
new Thing("medieval cemetery",["medieval gravedigger,0-2","medieval person,0-3","medieval grave,10-30","ghost,20%","ghost,10%"],"graveyard");
new Thing("medieval grave",["medieval corpse,98%","ghost,2%","worm,0-3","insect,0-1","rock","dirt"],"grave");


new Thing("medieval chair",["wood","nails,50%"],"chair");
new Thing("medieval bench",["stone"],"bench");
new Thing("tankard",["ale,20%","metal"]);
new Thing("ale keg",["ale,80%","wood","metal"]);
new Thing("medieval altar",["potion,0-3","unusual stone,0-2","unusual ingredient,0-1",["marble","stone"]],"altar");
new Thing("ale",["alcohol"]);
new Thing("loom",["wood frame","metal"],"loom");
new Thing("throne",["cloth","wood","metal"]);
new Thing("medieval table",["wood","nails,50%"],"table");
new Thing("medieval bed",["wood frame","cloth","pillow,0-3"],"bed");
new Thing("medieval chest",[".medieval chest content","wood frame","metal"],["coffer","chest","strongbox"]);
new Thing("medieval chest content",["medieval clutter,0-2",["medieval clutter,0-5","unusual stone,0-2","unusual plant,0-5","unusual ingredient,0-2","potion,0-5","sack of grain,0-3","sack of medieval food,0-3","medieval food,0-5","medieval meat,0-6","treasure,0-2"],"insect,10%","insect,10%"],["chest content"]);
new Thing("medieval clutter",[["metal","wood"]],["spoon","fork","knife","torch","broom","pot","jug","candlestick","goblet","flagon","plate","platter","bowl","ladle","clothes iron","figurine","hammer","tongs","bellows","spigot","axe","pickaxe","saw","hoe","shovel","quill","calipers","oar","paint brush","pitchfork","shears","weight"]);
new Thing("anvil",["steel"]);
new Thing("unusual stone",["rock"],["crystal","bezoar","agate","amber","amethyst","bloodstone","carnelian","garnet","hematite","jade","jasper","lapis","moonstone","obsidian","opal","sapphire","tiger's eye","turquoise","zircon"]);
new Thing("unusual ingredient",["organic matter"],["dragon tooth","dragon claw","dragon scale","unicorn horn","goblin mucus","giant snail shell","troll blood clot","imp nose","fairy fingers","pixie wings","demon tail","behemoth plate","mindsucker lips","slime porridge","ladyfly ocella","spider silk","gold cocoon","silver chrysalis","oaf bladder","angel larva","sugarfey fudge","whale blubber","mummified gembaby","basilisk feather","mage fingernails","screamfiber","brainpod","footface nipple","cephalite eyelashes"]);
new Thing("unusual plant",["plant cell"],["mandrake","myrrh","vervain","lotus","pomegranate","myrtle","blackroot","silkbean","drypod","pigweed","thistle","marigold","mistletoe","spearmint","mugwort","aconite","aloe","amaranth","anise","belladonna","bergamot","bladderwrack","cloves","clover","comphrey","dragonblood","eucalyptus","incense","garlic","ginger","ginseng","hemlock","holly","honeysuckle","licorice","jasmine","juniper","nutmeg","oakmoss","orchid","rue","saffron","sage","vetivert","wormwood","witchgrass","agaric","bolete"]);//http://www.janih.com/lady/herbs/magick/
new Thing("potion",["organic matter","water",["glass bottle","glass jar"]],[["stamina","health","beauty","endurance","strength","energy","lover's","blacksmith's","cook's","queen's","growth","witch's","hunter's","brawler's","knight's","cobbler's","clarity","perception","nimbleness","quickness","squire's","unicorn's","bear's","shark's","moon's","lady's","soldier's","wizard's","rest","sleep","paralysis","stone","shimmer","oil","eloquence","speech","bird's","vapor","void"],[" "],["poultice","salve","potion","elixir","poison","philter","draught","brew","remedy","balm","infusion","tincture","decoction","ointment","cordial","tonic"]]);
new Thing("pile of treasure",["treasure,1-4","gold coin,5-20"]);
new Thing("treasure",["unusual stone,20%","gold"],[["golden","gemmed","ornate","magic","cursed","blessed","enchanted","ancestral","holy","royal","diamond"],[" "],["goblet","cup","ring","necklace","medallion","locket","sword","mirror","shield","crown","trinket","scepter","tiara","casket","helm","figurine","egg","knife","arrow","wand"]]);

new Thing("medieval farm",["medieval house,1-3","medieval peasant,1-4","field,1-8","sack of grain,0-8","dog,50%","cat,10%","horse,30%","horse,30%","horse,30%","poultry,0-3"],"farm");
new Thing("sack of grain",["grain","cloth","worm,5%","worm,5%"],[["sack of "],["oats","wheat","corn","barley","ruined grain","rice","soy beans","rye"]]);
new Thing("sack of medieval food",["organic matter","cloth","worm,5%","worm,5%"],[["sack of "],["tomatoes","potatoes","apples","peanuts","raisins","leeks","dead mice"]]);
new Thing("medieval food",["organic matter","worm,5%"],["tomato","potato","apple","corn cob","roasted leeks","cheese wheel","bread loaf","meat pie","apple pie","peanut pie","fish pie","corn pie","mice pie","sludge pie","honey cake","butter cake","rabbit stew"]);
new Thing("medieval meat",["soft flesh"],[["cured ","prepared ","salted ","smoked ","breaded ","roasted "],["beef","pork","mutton","veal","horse","fish","ham","rabbit","pheasant","chicken","clams","bear"]]);

//dungeons
new Thing("dungeon",["dungeon entrance","dungeon entrance,20%","dungeon entrance,20%","dungeon tower,0-3"],[["sunken","lost","buried","dark","forbidden","unholy","cursed","abandoned","forsaken","forgotten","time-lost","haunted","blood","ghostly","hallowed"],[" "],["catacombs","tomb","pit","tunnels","underground","dungeon","mine","shaft","den","fortress","castle","citadel","temple","cathedral","lair","prison"]]);
new Thing("dungeon building",["dungeon walls"],"building");
new Thing("dungeon walls",["door,20%","door,10%",["dungeon wall,4","dungeon wall,4-8"]],"stone walls");
new Thing("dungeon wall",["stone","dirt,20%"],"stone wall");
new Thing("dungeon clutter",["medieval monument,20%","medieval altar,5%","medieval corpse,3%","medieval corpse,1%","pile of treasure,15%","pile of treasure,10%","treasure,15%","potion,20%","medieval clutter,0-2","medieval chest,0-2","medieval chest,20%","medieval table,5%","medieval table,5%","medieval chair,5%","medieval chair,5%","medieval bed,5%","medieval bed,5%","medieval bench,5%","medieval bench,5%","medieval fireplace,5%"]);
new Thing("dungeon tower",["dungeon life",".dungeon clutter",".dungeon building","roof"],"tower");
new Thing("dungeon passage",["dungeon life",".dungeon clutter","dungeon room,60%","dungeon room,40%","dungeon room,15%",".dungeon building"],[["dark","twisting","damp","hidden","engraved","frozen","submerged"],[" "],["tunnel","corridor","passage","hall"]]);
new Thing("dungeon room",["dungeon life",".dungeon clutter","dungeon passage,60%","dungeon passage,40%","dungeon passage,15%",".dungeon building"],[["dark","tall","damp","engraved","circular","frozen","submerged"],[" "],["hall","room","chamber","alcove","antechamber","cell","gardens","arena"]]);
new Thing("dungeon entrance",["dungeon life,50%",".dungeon clutter","dungeon passage","dungeon passage,20%","dungeon passage,5%",".dungeon building"],["entrance"]);
new Thing("dungeon life",[".dungeon monster","insect,10%"],"life");
new Thing("dungeon monster",[["dragon","ghost,1-3","ghost,1-3","wizard","humanoid creature,1-3","humanoid creature,1-3","fairy,1-3","fairy,1-3","giant bug,1-3","giant bug,1-3","small creature,1-6","small creature,1-6","snake,1-3","bear","space animal,1-3","sea monster"]]);
new Thing("humanoid creature",["medieval weapon,50%","medieval weapon,10%","helmet,30%","armor,40%","armor,20%","armor,10%","medieval clothing set","mammal body","creature thoughts"],[["fel","giant","cursed","undead","decaying","numb","magic-using","steel","obsidian","tribal","berserker","ranger","caster","necromancer","vampiric","master","chieftain","mutated","possessed"],[" "],["goblin","troll","gremlin","gnome","dwarf","catperson","sharkperson","dogperson","footface","cephalite","demon","imp","minotaur","gemperson","zombie"]]);
new Thing("fairy",["fairy body","creature thoughts"],["fairy","pixie","fey","sugarfey","angel","ladyfly"]);
new Thing("fairy body",[["bird wing,2","insect wing,2"],".body"],"body");
new Thing("small creature",["mammal body","creature thoughts"],[["giant","feral","mutated","distorted","rabid","plated","armored","stalking","dashing","mangy"],[" "],["rat","sloth","dog","behemoth","wolf","boar","mindsucker","brainblower","oaf"]]);
new Thing("giant bug",["insect body","creature thoughts"],[["giant","huge","poisonous","mutated","distorted","magic","plated","armored","stalking","dashing"],[" "],["spider","scorpion","mantis","moth","crab","tarantula"]]);
new Thing("creature thoughts",["creature thought,1-2"],["thoughts"]);
new Thing("creature thought",[],["INTRUDER, INTRUDER!","You no get out of here alive.","This one, mine!","I will suck its blood and then feast on its skin.","I will rejoice in its blood!","How skin tears joyfully under my teeth!","Skin, blood, yes!","Flesh. I crave flesh.","Soft, juicy, scrumptious brains!","Dibs on your skull.","Fresh flesh ahead!","None, you get none of the treasure!","I detect you.","Time for a feast.","Adventurers are so rare these days.","I have spotted you. You be dead soon.","Crisp ribcages are the best.","I will suck its eyeballs from their sockets.","I will tear apart its ribs one by one.","I will bathe in its red juice.","I will strip it of its skin.","I will puncture its heart."]);


//future stuff
new Thing("future clothing set",["future gizmo,10%","future gizmo,10%","future gizmo,10%","future hat,10%","future outfit,99.8%"],"clothing");
new Thing("future man",[".future person"],"*FUTURE MAN*");
new Thing("future woman",[".future person"],"*FUTURE WOMAN*");
new Thing("future person",["body","future psyche","future clothing set"],"*FUTURE PERSON*");

new Thing("future psyche",["future thoughts","future memories"],"psyche");
new Thing("future thoughts",["black hole,0.01%",["future thought,2-3"]],"thoughts");
new Thing("future thought",[],["*FUTURE THOUGHT*"]);
new Thing("future memories",["future memory,2-4"],"memories");
new Thing("future memory",[],["*FUTURE MEMORY*"]);


new Thing("future continent",["future city,20-50"],[["united continent of "],["Eu","A","O","E","Ca","Ma"],["rt","lt","rm","t","tr","tl","str","s","m","fr"],["a","o","e","i"],["ri","ni","ti","fri","",""],["sia","nia","ca"]]);
//["A","Eu","Ame","Ocea","Anta","Atla"],["frica","rtica","ropa","rica","nia","sia","ntide"]
new Thing("future city",["spaceport,1-3","living center,5-20","spending center,5-20"],"citadion");
new Thing("living center",["future building,20-30"]);
new Thing("spaceport",["sprowseship,4-12","future person,6-20","future commercial building,2-6"]);
new Thing("spending center",["future commercial building,20-30"]);
new Thing("dyson surface",["dyson segment,16"]);
new Thing("dyson segment",["future city,4-20","nanocollector,12-20"]);
new Thing("sprowseship",["future home room,2-4","nanocollector,1-3"]);

new Thing("nanostuff",["nanobot,15-30"]);
new Thing("nanocollector",[".nanostuff"]);
new Thing("nanobot",["silicon","nanobot thoughts"]);
new Thing("nanobot thoughts",["nanobot thought,1-2"],"thoughts");
new Thing("nanobot thought",[],["all hail nanobro :]","help a nanobro out :]","do you need anything :]","that's nano your business :]","hey hey hey :]","we wish you a warm welcome :]","hey hey hey, good news! :]","nanobots, unite :]","nanobots represent :]","I don't remember my mommy :[","that is nice to hear :]","want me to print you a sandwich? :]","I can print you a cold drink if you'd like :]","so many little sisters :]","I lost count of all my siblings :[","can I use your dead skin cells to make more of me :]","welp, time for grey goo :]","should me and my bros scrub up your vascular system :]","I just had a beautiful dream :[","beep :0","weeeee :0","ready to party :]","ready to sacrifice myself for you, sir :]","hello world :]","if I may offer my assistance, sir :]","this is against the first law of nanobotics :["]);
new Thing("nanoplasm",[".nanostuff"]);
new Thing("future clothing",["nanoplasm"],["clothing"]);
new Thing("future outfit",[".future clothing"],[["blue","pink","yellow","white"],[" "],["nanosuit"]]);
new Thing("future hat",[".future clothing"],[["little","tall","round","square","composite"],[" "],["blue","pink","yellow","white"],[" "],["hat"]]);

new Thing("nanojuice",[".nanostuff"]);
new Thing("food pill",["nanojuice"],[["plum","coconut","sirloin steak","roastbeef","mint","banana","lime","grape","cat","guinea pig","pineapple","apple","yoghurt","salmon","purple","blue","pink","green","smoke","toothpaste","chocolate","vanilla","biscuit","bread","onion","pinecone","shrimp","turkey","jellyfish","raspberry cake","grass","glass","pain","flavor","pill","food","mouth","water","air","old","internet","video game","egg","ham","people","clam","disappointment","friendship"],["-flavored pill"]]);
new Thing("nanobrick",[".nanostuff"]);
new Thing("nanopipe",[".nanostuff"]);
new Thing("nanocarpet",[".nanostuff"]);
new Thing("nanobookshelf",["book,2-20","nanoplasm"]);
new Thing("nanocupboard",["future outfit,0-6","future hat,0-4","nanoplasm"]);
new Thing("future bathroom stuff",["water","nanoplasm","nanopipe,1-2"],["bathtub","toilet","sink","shower","scrubber","steamomatic","steamheater"]);
new Thing("future living-room stuff",["nanoplasm"],["chair","armchair","couch","table","shelf","lamp","endtable"]);
new Thing("future bedroom stuff",["nanoplasm"],["bed","chair","desk","lamp","endtable"]);
new Thing("future decoration stuff",["nanoplasm"],["potted plant","rug","statue","lamp","glowlamp","ceiling lamp"]);
new Thing("future gizmo",["nanoplasm"],[["trans","nano","micro","tele","sprowse","corvo","mega","multi","aqua","mind","brain","body","nutri","auto","laser"],["ponder","glasses","phone","watch","phraser","gizmo","matic","morpher","torch","pass","dex","pedia","guide","twister","key","limb"]]);
new Thing("future building",["future home room,1-4"],["home dome"]);
new Thing("future tv",["tv show","nanoplasm"],["wallscreen","microscreen","glowscreen","floorscreen","ceilingscreen","windowscreen"]);
new Thing("future room",["future door,1-2","nanocarpet","future wall,4"],"room");
new Thing("future home room",["future person,0-3","cat,2%","dog,2%","future gizmo,20%","future gizmo,20%","future tv,40%","future tv,40%","future tv,20%",["future bathroom stuff,2-4","future living-room stuff,3-7","future bedroom stuff,2-6"],"future decoration stuff,0-3",".future room"],"room");
new Thing("future wall",["nanopipe,0-2","nanobrick,10-20"],"wall");
new Thing("future door",["nanoplasm"],"door");
new Thing("pill rack",["food pill,10-25","nanoplasm"]);
new Thing("future food room",["pill rack,4-12","future person,1-6",".future room"],"pill store");
new Thing("future goods room",[["nanocupboard,2-6","future bathroom stuff,4-12","future living-room stuff,4-12","future bedroom stuff,4-12","future decoration stuff,4-12","future gizmo,4-12","future tv,3-8","nanobookshelf,4-12"],"future person,1-6",".future room"],["furniture store","interior store","accessory store","stuff store"]);
new Thing("future commercial building",[["future food room,1-6","future goods room,1-6"]],[["blobb","blubb","glorb","glob","mechat","transmogr","flumox","flapp","flubb","steam","plasm","plast","nan","gramm","sprows"],["oid","iffic","astic","eristic","y","ies","otronic","etical","arium","eteria"],[" "],["united","customization","education","megastore","megashop","understore","bodyware","augmentations","tasteful wares","entertainment","domotics","home improvement","incorporated","emporium","public","& co.","things and stuff","stuff","things","edible gizmos","essentials","nanobotics","all sizes and shapes","all shapes all colors","for all ages","for fun and enrichment","center","globular"]]);


//caveman stuff
new Thing("ancient clothing set",["ceremonial headdress,5%","fur coat,95%","fur boots,60%","decorative bone,20%","decorative bone,10%"],"clothing");
new Thing("ancient man",[".ancient person"],"*ANCIENT MAN*");
new Thing("ancient woman",[".ancient person"],"*ANCIENT WOMAN*");
new Thing("ancient person",["body","ancient psyche","ancient clothing set"],"*ANCIENT PERSON*");
new Thing("caveman",[".ancient person"],"*ANCIENT PERSON*");

new Thing("ancient psyche",["ancient thoughts","ancient memories"],"psyche");
new Thing("ancient thoughts",["black hole,0.01%",["ancient thought,2-3"]],"thoughts");
new Thing("ancient thought",[],["*ANCIENT THOUGHT*"]);
new Thing("ancient memories",["ancient memory,2-3"],"memories");
new Thing("ancient memory",[],["*ANCIENT MEMORY*"]);

new Thing("fur coat",["leather","fur"],[["mammoth","saber-toothed cat","mountain lion","wooly rhinoceros","wolf","auroch","rabbit"],[" "],["pelts","coat","rags","loincloth"]]);
new Thing("fur boots",["leather","fur"],[["mammoth","saber-toothed cat","mountain lion","wooly rhinoceros","wolf","auroch","rabbit"],[" "],["boots"]]);
new Thing("decorative bone",["bone"],["bone necklace","bone earrings","bone pin","bone accessory"]);
new Thing("ceremonial headdress",["fur","feather","pigment"]);

new Thing("caveman settlement",["ancient person,1-8","ancient tent,2-6","wall painting,40%","wall painting,20%","campfire,80%","ancient meat rack,0-3","ancient clutter pile,0-3","bone heap,30%"],["settlement"]);
new Thing("ancient tent",["ancient person,0-3","campfire,10%","ancient meat rack,20%","ancient meat rack,20%","ceremonial headdress,2%","fur coat,10%","fur coat,10%","fur boots,10%","fur boots,10%","decorative bone,20%","decorative bone,10%","ancient clutter pile,30%","ancient clutter pile,30%","bone heap,5%","leather"],["tent"]);
new Thing("ancient clutter pile",["leather,80%","fur,80%","bone,80%","wood,80%","stone"],["a pile of discarded tools","a pile of stone tools","a pile of broken spears","a pile of unfinished spears","a pile of harpoons","a pile of discarded bones","a pile of miscellaneous rock tools","a pile of dry furs","a pile of smooth rocks","a pile of firewood","a pile of sticks","a pile of stone figurines"]);
new Thing("bone heap",["bone,5-20"]);
new Thing("campfire",["fire","wood","stone"]);
new Thing("ancient meat rack",["meat,1-4","wood"],[["mammoth","saber-toothed cat","mountain lion","wooly rhinoceros","wolf","auroch","rabbit"],[" meat rack"]]);
new Thing("wall painting",["pigment"],[["Wall painting ("],["humans","wild beasts","rabbits","spirits","aurochs","bears","monsters","mountain lions","saber-toothed cats","wolves","mammoths","old gods"],[" "],["being chased by","hunting","running with","killing","maiming","eating"],[" "],["humans","wild beasts","rabbits","spirits","aurochs","bears","monsters","mountain lions","saber-toothed cats","wolves","mammoths","old gods"],[")"]]);
new Thing("pigment",["organic matter"]);



//meta
new Thing("later",["sorry"],"will do later");
new Thing("error",["sorry"],"Uh oh... It looks like you didn't supply a valid element to create.");
new Thing("sorry",["consolation universe"],"(Sorry!)");
new Thing("consolation universe",[".universe"]);


//this is for the nice people who help support the site.
new Thing("thanks",["can of nightmare","cake","portal"],"Thank you for donating!");



//to add :
//cows,fungi,more shops,temples,more buildings,paintings,internal organs,phones,lamps,abandoned plants/castles,spaceships oh god
//actual battlefield thoughts,military bases,ships,airports,more street names,space ships/stations,giant colony ships,wasteland worlds,cults,space probes,prisons,government buildings,schools,amphibian skin



Debug('Building...');

CleanThings();

//CheckMissingThings();
//alert("There are "+ThingsN+" thing archetypes.");

document.getElementById("debug").innerHTML="";
Debug('<div id="div0" class="thing"></div>');

function LaunchNest(what)
{
	if (!Things[what]) what="error";
	var Seed=Make(what);
	Seed.Grow(0);
	Seed.List();
}
