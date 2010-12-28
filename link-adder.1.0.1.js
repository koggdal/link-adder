/*!
*	Link Adder 1.0.1
*	WordPress Plugin / Bookmarklet
*	http://koggdal.com/extras/link-adder/
*
*	by Johannes Koggdal, 2010
*	http://koggdal.com/
*/
(function( window, document, undefined ){

	/* Setup the link adder */
	var settings = {
		id: 'link-adder',
		plugin_folder: 'http://koggdal.com/wp/wp-content/plugins/link-adder/',
		hash: ''
	};
	
	/* Remove the box if it already exists */
	if(document.getElementById(settings.id+'_bg') !== null){
		document.body.removeChild(document.getElementById(settings.id+'_bg'));
		document.body.removeChild(document.getElementById(settings.id));
		document.removeEventListener('keydown',closeKeyboard,false);
	}
	
	/* Trim beginning and end of string (removes spaces, tabs, new lines and such) */
	var trim = function(input){
		var output = input.replace(new RegExp('^[\\s]+', 'g'), ''); // Beginning
		output = output.replace(new RegExp('[\\s]+$', 'g'), ''); // End
		return output;
	},
	
	/* Strips HTML tags from string, also removes new lines and tabs */
	stripTags = function(input){
		var inTag = false,
			output = '';
	
		for(var i = 0; i < input.length; i++){
			if(input.charAt(i) == '<'){
				inTag = true;
				continue;
			}
			if(input.charAt(i) == '>'){
				inTag = false;
				continue;
			}
			if(!inTag)
				output += input.charAt(i);
		}
		
		output = output.replace('\n','').replace('\t','');
		
		return output;
	},
	
	/* Replace HTML entities with the correct characters */
	fixEntities = function(input){
		var search = ['&amp;'],
			replace = ['&'],
			output = input;
		
		for(var i = 0; i < search.length; i++)
			output = output.replace(search[i],replace[i]);
		
		return output;
	},
	
	/* Create HTML elements */
	objects = {
		bg: document.createElement('div'),
		form: document.createElement('form'),
		fieldset: document.createElement('fieldset'),
		heading: document.createElement('h1'),
		label_title: document.createElement('label'),
		input_title: document.createElement('input'),
		label_url: document.createElement('label'),
		input_url: document.createElement('input'),
		label_description: document.createElement('label'),
		textarea_description: document.createElement('textarea'),
		submit: document.createElement('button'),
		cancel: document.createElement('button'),
		post: document.createElement('script')
	},
	
	/* Set styles (some declarations are for resetting styles the current website has set) */
	styles = {
		bg: {
			width: '100%',
			height: '100%',
			position: 'fixed',
			zIndex: '99998',
			top: '0',
			left: '0',
			background: 'rgba(0,0,0,0.8)'
		},
		form: {
			position: 'fixed',
			zIndex: '99999',
			top: '-300px',
			left: (window.innerWidth-500)/2+'px',
			width: '500px',
			margin: '0 auto',
			padding: '20px',
			background: '#fff',
			WebkitBorderRadius: '0 0 10px 10px',
			MozBorderRadius: '0 0 10px 10px',
			borderRadius: '0 0 10px 10px',
			font: '14px/1 Helvetica Neue,Arial,Helvetica,sans-serif'
		},
		fieldset: {
			border: '0',
			margin: '0',
			padding: '0'
		},
		heading: {
			font: 'bold 22px/1 Helvetica Neue,Arial,Helvetica,sans-serif',
			letterSpacing: '0',
			color: '#000000',
			margin: '0 0 20px 0'
		},
		label_title: {
			cssFloat: 'left',
			width: '80px',
			color: '#000',
			margin: '0',
			padding: '0'
		},
		input_title: {
			width: '408px',
			margin: '0',
			padding: '5px',
			background: '#fff',
			WebkitBorderRadius: '3px',
			MozBorderRadius: '3px',
			borderRadius: '3px',
			border: '1px solid #dedede',
			fontSize: '14px',
			WebkitBoxSizing: 'content-box',
			MozBoxSizing: 'content-box',
			boxSizing: 'content-box',
			WebkitBoxShadow: 'none',
			MozBoxShadow: 'none',
			boxShadow: 'none'
		},
		textarea_description: {
			width: '408px',
			margin: '0',
			padding: '5px',
			background: '#fff',
			WebkitBorderRadius: '3px',
			MozBorderRadius: '3px',
			borderRadius: '3px',
			border: '1px solid #dedede',
			fontSize: '14px',
			WebkitBoxSizing: 'content-box',
			MozBoxSizing: 'content-box',
			boxSizing: 'content-box',
			WebkitBoxShadow: 'none',
			MozBoxShadow: 'none',
			boxShadow: 'none'
		},
		submit: {
			display: 'block',
			margin: '20px 10px 0 0',
			padding: '3px 8px',
			border: '1px solid #298CBA',
			background: '#21759B',
			color: '#ffffff',
			WebkitBorderRadius: '11px',
			MozBorderRadius: '11px',
			borderRadius: '11px',
			cursor: 'pointer',
			fontSize: '14px',
			WebkitBoxShadow: 'none',
			MozBoxShadow: 'none',
			boxShadow: 'none',
			cssFloat: 'left'
		},
		cancel: {
			display: 'block',
			margin: '20px 0 0 0',
			padding: '3px 8px',
			border: '1px solid #bababa',
			background: '#9b9b9b',
			color: '#ffffff',
			WebkitBorderRadius: '11px',
			MozBorderRadius: '11px',
			borderRadius: '11px',
			cursor: 'pointer',
			fontSize: '14px',
			WebkitBoxShadow: 'none',
			MozBoxShadow: 'none',
			boxShadow: 'none'
		}
	};
	styles.label_url = styles.label_description = styles.label_title;
	styles.input_url = styles.input_title;
	
	/* Add the styles to the elements */
	for(var obj in styles){
		for(var style in styles[obj]){
			objects[obj].style[style] = styles[obj][style];
		}
	}
	
	/* Element properties */
	objects.bg.id = settings.id+'_bg';
	objects.form.id = settings.id;
	objects.heading.innerHTML = 'Add Link to %SITENAME%';
	objects.label_title.innerHTML = 'Title';
	objects.label_url.innerHTML = 'URL';
	objects.label_description.innerHTML = 'Description';
	objects.submit.innerHTML = 'Add link';
	objects.submit.setAttribute('type','button');
	objects.cancel.innerHTML = 'Cancel';
	objects.cancel.setAttribute('type','button');
	
	/* Animations */
	var animate = function(object,values,duration,fps,cb){
		duration = duration || 1000;
		fps = fps || 30;
		var startValues = [],
			endValues = [],
			changeValues = [],
			currentValues = [],
			properties = [];
		
		/* Get values */
		for(var property in values){
			properties.push(property);
			startValues.push(parseInt(object.style[property]));
			endValues.push(parseInt(values[property]));
			currentValues.push(parseInt(object.style[property]));
			changeValues.push(parseInt((values[property])-parseInt(object.style[property]))/(fps/1000*duration));
		}
	
		var num_properties_left = properties.length,
		
		/* This function does the animation for all the properties
		   It runs repeatedly until the animation is done */
		anim = function(){
			for(var i = properties.length; i--;){
				/* Check if the end value has been reached,
				   and then abort animation of that property */
				if(startValues[i] < endValues[i] && currentValues[i] >= endValues[i]){
					num_properties_left--;
					continue;
				}else if(startValues[i] > endValues[i] && currentValues[i] <= endValues[i]){
					num_properties_left--;
					continue;
				}
				
				// Increment current value
				currentValues[i] += changeValues[i];
				
				/* Set the current value to the end value if it is larger */
				if(currentValues[i] >= endValues[i] && startValues[i] < endValues[i])
					currentValues[i] = endValues[i];
				else if(currentValues[i] <= endValues[i] && startValues[i] > endValues[i])
					currentValues[i] = endValues[i];
				
				/* Add the style to the element */
				object.style[properties[i]] = currentValues[i]+(properties[i] == 'opacity' ? '' : 'px');
			}
			
			/* If there are properties left to animate, continue animation
			   Otherwise, fire the callback function if it exists */
			if(num_properties_left > 0)
				setTimeout(anim,1000/fps);
			else if(cb !== undefined)
				cb();
		};
		// Start the animation
		anim();
	},
	
	/* Use an animation to show the box */
	openBox = function(){
		animate(objects.form,{top:0},250,60);
	},
	
	/* Use an animation to hide the box */
	closeBox = function(){
		animate(objects.form,{top:-300},250,60,function(){
			close();
		});
	},
	
	/* Remove the elements from the page and remove event handlers */
	close = function(){
		document.body.removeChild(document.getElementById(settings.id+'_bg'));
		document.body.removeChild(document.getElementById(settings.id));
		document.removeEventListener('keydown',closeKeyboard,false);
	},
	
	/* Close the box if the user presses the escape key */
	closeKeyboard = function(e){
		if(e.keyCode == 27 || e.which == 27)
			closeBox();
	};
	
	
	/* Event handlers */
	
	/* Post link on submit button */
	objects.submit.addEventListener('click',function(){
		/* Set the src attribute of the script element to the URL of the plugin PHP file */
		objects.post.setAttribute('src',settings.plugin_folder+'link-adder_add.php'
				+'?title='+objects.input_title.value
				+'&url='+objects.input_url.value
				+'&description='+objects.textarea_description.value
				+'&hash='+settings.hash
		);
		
		/* Add the script element to the page to post the link */
		document.getElementById(settings.id).appendChild(objects.post);
		
		closeBox();
	},false);
	
	/* Close the box when the user clicks the cancel button */
	objects.cancel.addEventListener('click',closeBox,false);
	
	/* Close the box when the user clicks the background */
	objects.bg.addEventListener('click',closeBox,false);
	
	/* Close the box when the user hits escape */
	document.addEventListener('keydown',closeKeyboard,false);
	
	
	/* Fill in values */
	/* Get all the h1 tags of the current site */
	var h1s = document.getElementsByTagName('h1');
	/* Set the title text to the value of the first h1, if present */
	objects.input_title.value = h1s.length > 0 ? trim(fixEntities(stripTags(h1s[0].innerHTML))) : '';
	/* Set the URL text to the location of the current page */
	objects.input_url.value = window.location;
	
	/* Add elements to viewport */
	objects.form.appendChild(objects.fieldset);
	objects.fieldset.appendChild(objects.heading);
	objects.fieldset.appendChild(objects.label_title);
	objects.fieldset.appendChild(objects.input_title);
	objects.fieldset.appendChild(objects.label_url);
	objects.fieldset.appendChild(objects.input_url);
	objects.fieldset.appendChild(objects.label_description);
	objects.fieldset.appendChild(objects.textarea_description);
	objects.fieldset.appendChild(objects.submit);
	objects.fieldset.appendChild(objects.cancel);
	document.body.appendChild(objects.bg);
	document.body.appendChild(objects.form);
	
	/* Show the box */
	openBox();
	
})( window, document );